import { create } from "zustand";
import PracticeDetails from "../components/PracticeDetails";

const usePaymentsPageStore = create((set) => ({
  paymentsPageDropDownStates: {},

  toggleUniquePaymentsPage: (appointmentId) => {
    set((state) => {
      const newState = { ...state.paymentsPageDropDownStates };
      if (!newState.hasOwnProperty(appointmentId)) {
        newState[appointmentId] = false;
      }
      newState[appointmentId] = !newState[appointmentId];
      return {
        ...state.paymentsPageDropDownStates,
        paymentsPageDropDownStates: newState,
      };
    });
  },
}));

const useAppointmentPortalStore = create((set) => ({
  appointmentsThathaveInvoices: {},
  setAppsThatHaveInvoices: (dataObject) =>
    set((state) => ({
      appointmentsThathaveInvoices: {
        ...state.appointmentsThathaveInvoices,
        ...dataObject,
      },
    })),
}));

const useInvoiceProgessComponent = create((set) => ({
  leftColCount: 0,
  middleColCount: 0,
  rightColCount: 0,
  leftColTotalAmount: 0,
  rightColTotalAmount: 0,
  middleColTotalAmount: 0,

  getLeftColCount: (length) => set((state) => ({ leftColCount: length })),
  getMiddleColCount: (length) =>
    set((state) => ({
      middleColCount: length,
    })),
  getRightColCount: (length) => set((state) => ({ rightColCount: length })),
  getRightColTotalAmount: (data) =>
    set((state) => ({
      rightColTotalAmount: getTotal(data),
    })),
  getleftColTotalAmount: (data) =>
    set((state) => ({
      leftColTotalAmount: getTotal(data),
    })),

  getmiddleColTotalAmount: (data) =>
    set((state) => ({
      middleColTotalAmount: getTotal(data),
    })),
}));

const useInvoiceListDropDown = create((set) => ({
  invoicePageListdropdownStates: {},
  toggleStates: (invoiceId) =>
    set((state) => {
      const newState = { ...state.invoicePageListdropdownStates };
      if (!newState.hasOwnProperty(invoiceId)) {
        newState[invoiceId] = false;
      }
      newState[invoiceId] = !newState[invoiceId];
      return {
        invoicePageListdropdownStates: newState,
      };
    }),
}));

function getTotal(data) {
  let total = 0;
  data.forEach((invoice) => {
    if (invoice.total_amount !== null) {
      total += parseFloat(invoice?.total_amount);
    }
  });
  return total;
}

const useFlags = create((set) => ({
  invoiceDropDownVisible: false,
  toggleInvoiceDropDownVisibility: (id) =>
    set((state) => ({
      invoiceDropDownVisible: !state.invoiceDropDownVisible,
    })),
}));

export {
  usePaymentsPageStore,
  useAppointmentPortalStore,
  useInvoiceProgessComponent,
  useInvoiceListDropDown,
  useFlags,
};

export const useAppointmentDataFromCreateAppointment = create((set) => ({
  patientData: {},
  appointmentTypeData: {},
  appointmentData: {},
  profileData: {},
  practiceDetails: {
    appointment_name: "Mathers Chiropractic",
    address: "1 dahlia street northmead ext 4 benon 1501",
  },
  setPatientData: (patientDataObj) => set({ patientData: patientDataObj }),
  setAppointmentTypeData: (apptypeDataObj) =>
    set({ appointmentTypeData: apptypeDataObj }),
  setAppointmentData: (appointmentDataObj) =>
    set({ appointmentData: appointmentDataObj }),
  setProfileData: (profileDataObj) => set({ profileData: profileDataObj }),
  setPracticeDetails: (practiceDataObj) =>
    set({ practiceDetails: practiceDataObj }),
}));

export const useAppointmentTypeAndIcdAutomationsPage = create(
  (set, getState) => ({
    icdPriceTotal: undefined,
    icd10List: [],
    arrayOfIcdIdsToDelete: [],
    arrayOfIcdsToUpdate: [],
    copyOfOrginalIcdData: [],
    count: -30,
    setIcd10List: (icdData) => {
      getState().resetTotal();
      set({
        icd10List: icdData,
      });

      set({ copyOfOrginalIcdData: icdData });

      if (icdData) {
        icdData.forEach((icdCode) =>
          getState().incrementTotal(
            (icdCode?.price && icdCode.price) || undefined
          )
        );
      }
    },

    resetArrayOfIcdIdsToDelete: () => set({ arrayOfIcdIdsToDelete: [] }),

    incrementCount: () =>
      set((state) => ({
        count: state.count + 1,
      })),

    updateIcdList: (newDataObj) => {
      let modifiedObj = {};
      if (newDataObj) {
        modifiedObj = { ...newDataObj, id: getState().count };
        console.log("the modfied object is " + JSON.stringify(modifiedObj));
        getState().incrementCount();
      }
      set((state) => ({
        icd10List: [...state.icd10List, modifiedObj],
      }));
      set((state) => ({
        arrayOfIcdsToUpdate: [...state.arrayOfIcdsToUpdate, modifiedObj],
      }));
    },
    resetAll: () =>
      set({
        icd10List: [],
        icdPriceTotal: undefined,
        arrayOfIcdIdsToDelete: [],
        arrayOfIcdsToUpdate: [],
        copyOfOrginalIcdData: [],
        count: -30,
      }),
    resetTotal: () =>
      set({
        icdPriceTotal: undefined,
      }),

    decrementTotal: (number) => {
      if (!number) return;
      set((prevState) => ({
        icdPriceTotal: (prevState.icdPriceTotal || 0) - parseFloat(number),
      }));
    },

    incrementTotal: (number) => {
      if (!number) return; // If number is falsy, return early
      set((prevState) => ({
        // Using prevState to avoid issues with concurrent updates
        icdPriceTotal: (prevState.icdPriceTotal || 0) + parseFloat(number), // Increment icdPriceTotal by number
      }));
    },
    deleteIcdListItem: (id) => {
      const orginalICDData = getState().copyOfOrginalIcdData;
      const arrayOfIcdsToUpdate = getState().arrayOfIcdsToUpdate;

      if (orginalICDData) {
        const icd = orginalICDData.find((element) => {
          return element.id === id;
        });
        console.log("icd id of deleteIcd is +", JSON.stringify(icd));
        if (icd) {
          set((state) => ({
            arrayOfIcdIdsToDelete: [...state.arrayOfIcdIdsToDelete, icd.id],
          }));
        }
      }
      if (arrayOfIcdsToUpdate && arrayOfIcdsToUpdate.length > 0) {
        const newArray = arrayOfIcdsToUpdate.filter((icd) => icd.id !== id);
        set({ arrayOfIcdsToUpdate: newArray });
      }
      set((state) => {
        const newList = state.icd10List.filter((icdItem) => icdItem.id !== id);
        return { icd10List: newList };
      });
    },
  })
);

export const useAppointmentTypeListComponenet = create((set) => ({
  refetchAppointmentListTypeData: null,
  setRefetchAppointmentListTypeData: (callback) =>
    set({
      refetchAppointmentListTypeData: callback,
    }),
}));
