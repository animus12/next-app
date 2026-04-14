import { create } from "zustand";
import { persist } from "zustand/middleware";

type BearState = {
  bears: string;
  setBear: (name: string) => void;
	 clearBear: () => void; 
};

export const useBear = create<BearState>()(
  persist(
    (set) => ({
      bears: "",
      setBear: (name) => set({ bears: name }),
			clearBear: () => set({ bears: "" }),
    }),
    {
      name: "user-storage", // 🔥 key sa localStorage
    }
  )
);