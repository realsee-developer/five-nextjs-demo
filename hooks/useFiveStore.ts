import { create } from "zustand";
import { Five } from "@realsee/five";

interface FiveState {
  five: Five | null;
  setFive: (five: Five) => void;
}

/**
 * Global store for the Five instance.
 * allowing other components to access the VR engine instance.
 */
export const useFiveStore = create<FiveState>((set) => ({
  five: null,
  setFive: (five: Five) => set({ five }),
}));
