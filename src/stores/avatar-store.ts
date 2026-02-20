import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AvatarState, type Gender, defaultAvatarState } from '@/lib/avatar-config';

interface AvatarStore {
  gender: Gender | null;
  state: Omit<AvatarState, 'gender'>;
  setGender: (g: Gender) => void;
  updateField: <K extends keyof Omit<AvatarState, 'gender'>>(key: K, value: AvatarState[K]) => void;
  toggleMultiField: (key: 'features' | 'clothing', id: string) => void;
  reset: () => void;
}

export const useAvatarStore = create<AvatarStore>()(
  persist(
    (set) => ({
      gender: null,
      state: { ...defaultAvatarState },
      setGender: (g) => set({ gender: g, state: { ...defaultAvatarState } }),
      updateField: (key, value) =>
        set((s) => ({ state: { ...s.state, [key]: value } })),
      toggleMultiField: (key, id) =>
        set((s) => {
          const arr = s.state[key] as string[];
          const next = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
          return { state: { ...s.state, [key]: next } };
        }),
      reset: () => set({ gender: null, state: { ...defaultAvatarState } }),
    }),
    { name: 'avatar-builder-state' }
  )
);
