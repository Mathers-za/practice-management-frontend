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

export { usePaymentsPageStore };
