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

const useAppointmentListsStore = create((set) => ({
  globalRefetchAppointmentList: "",
  flagToRefreshAppointmentList: false,

  setGlobalRefetchAppointmentList: (callback) =>
    set({
      globalRefetchAppointmentList: callback,
    }),
  setFlagToRefreshAppointmentList: (boolean) =>
    set({
      flagToRefreshAppointmentList: boolean,
    }),
}));

const useInvoiceProgessComponent = create((set) => ({
  leftColCount: 0,
  middleColCount: 0,
  rightColCount: 0,
  leftColTotalAmount: 0,
  rightColTotalAmount: 0,
  middleColTotalAmount: 0,
  refreshInvoiceData: undefined,

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

  setRefreshInvoiceData: (callback) =>
    set({
      refreshInvoiceData: callback,
    }),
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
  useAppointmentListsStore as useAppointmentPortalStore,
  useInvoiceProgessComponent,
  useInvoiceListDropDown,
  useFlags,
};

export const useGlobalStore = create((set) => ({
  globalRefetch: "",
  globalPatientData: "",
  globalAppointmentTypeData: {},
  globalAppointmentData: {},
  globalProfileData: { id: localStorage.getItem("profileIdFk") },
  globalPracticeDetailsData: {},
  globalFinancialData: {},
  globalInvoiceData: {},
  setGlobalInvoiceData: (invoiceDataObj) =>
    set({
      globalInvoiceData: invoiceDataObj,
    }),
  setGlobalFinancialData: (financialDataObj) =>
    set({
      globalFinancialData: financialDataObj,
    }),
  setGlobalRefetch: (callback) =>
    set({
      globalRefetch: () => callback(),
    }),
  setGlobalPatientData: (patientDataObj) =>
    set({ globalPatientData: patientDataObj }),
  setGlobalAppointmentTypeData: (apptypeDataObj) =>
    set({ globalAppointmentTypeData: apptypeDataObj }),
  setGlobalAppointmentData: (appointmentDataObj) =>
    set({ globalAppointmentData: appointmentDataObj }),
  setGlobalProfileData: (profileDataObj) => {
    localStorage.setItem("profileIdFk", profileDataObj.id);
    set({
      globalProfileData: {
        ...profileDataObj,
        id: localStorage.getItem("profileIdFk"),
      },
    });
  },
  setGlobalPracticeDetails: (practiceDataObj) =>
    set({ globalPracticeDetailsData: practiceDataObj }),
}));

export const useAppointmentTypeAndIcdAutomationsPage = create(
  (set, getState) => ({
    icdPriceTotal: undefined,
    icd10List: [],
    arrayOfIcdIdsToDelete: [],
    arrayOfIcdsToUpdate: [],
    copyOfOrginalIcdData: [],
    count: -30,
    appTypeEditLoadingState: false,
    predefinedIcdComponentLoadingState: false,
    setApptypeEditLoadingState: (loadingState) =>
      set({
        appTypeEditLoadingState: loadingState,
      }),
    setPredefinedIcdComponentLoadingState: (loadingState) =>
      set({
        predefinedIcdComponentLoadingState: loadingState,
      }),
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
      if (!number) return;
      set((prevState) => ({
        icdPriceTotal: (prevState.icdPriceTotal || 0) + parseFloat(number),
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

export const useDashboardComponent = create((set) => ({
  profileData: {},
  practiceDetailsData: {},
  setProfileData: (profileData) =>
    set({
      profileData: profileData,
    }),
  setPracticeDetailsData: (practiceData) =>
    set({
      practiceDetailsData: practiceData,
    }),
}));

export const useAppointmentCard = create((set) => ({
  patientData: {},
  setPatientData: (patientData) =>
    set({
      patientData: patientData,
    }),
}));

export const usePatientPortalStore = create((set) => ({
  patientData: "",
  patientId: localStorage.getItem("patientIdFk"),
  appointmentTabLoadingState: false,
  invoiceTabLoadingState: false,
  treatmentNotesTabLoadingState: false,

  setAppointmentTabLoadingState: (loadingState) =>
    set({
      appointmentTabLoadingState: loadingState,
    }),
  setInvoiceTabLoadingState: (loadingState) =>
    set({
      invoiceTabLoadingState: loadingState,
    }),
  setTreatmentNotesTabLoadingState: (loadingState) =>
    set({
      treatmentNotesTabLoadingState: loadingState,
    }),
  setPatientId: (id) => {
    localStorage.setItem("patientIdFk", id);
    set({
      patientId: id,
    });
  },
  setPatientData: (patientDataObj) =>
    set({
      patientData: patientDataObj,
    }),
}));

export const useClientInfoPortal = create((set) => ({
  patientContactDetailsPageLoadingState: false,
  medicalAidLoadingState: false,
  additionalInformationLoadingState: false,
  setPatientContactDetailsPageLoadingState: (loadingState) =>
    set({
      patientContactDetailsPageLoadingState: loadingState,
    }),
  setMedicalAidLoadingState: (loadingState) =>
    set({
      medicalAidLoadingState: loadingState,
    }),
  setAdditionalInformationLoadingState: (loadingState) =>
    set({
      additionalInformationLoadingState: loadingState,
    }),
}));

export const useTextContentComponent = create((set) => ({
  textContentLoadingState: false,

  setTextContentLoadingState: (loadingState) =>
    set({
      textContenLoadingState: loadingState,
    }),
}));

export const useIcd10Component = create((set) => ({
  isSuccessfullMutation: false,
  error: false,
  successfullMutationFeedbackMessage: "Success",
  setIsSuccessfullMutation: (isSuccessFlag) =>
    set({
      isSuccessfullMutation: isSuccessFlag,
    }),
  setError: (error) =>
    set({
      error: error,
    }),
  setSuccessfullMutationFeedbackMessage: (customSuccessMessage) =>
    set({
      successfullMutationFeedbackMessage: customSuccessMessage,
    }),
}));

export const useDashBoardSideBar = create((set) => ({
  sideBarToggleState: false,
  setSideBarToggleState: () =>
    set((state) => ({
      sideBarToggleState: !state.sideBarToggleState,
    })),
}));
