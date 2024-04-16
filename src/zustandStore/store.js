import { create } from "zustand";

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
  setPatientData: (patientDataObj) => set({ patientData: patientDataObj }),
  setAppointmentTypeData: (apptypeDataObj) =>
    set({ appointmentTypeData: apptypeDataObj }),
  setAppointmentData: (appointmentDataObj) => set({ appointmentDataObj }),
  setProfileData: (profileDataObj) => set({ profileData: profileDataObj }),
}));
