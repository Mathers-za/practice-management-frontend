import create from "zustand";

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

export { usePaymentsPageStore, useAppointmentPortalStore };
