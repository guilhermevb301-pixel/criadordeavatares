import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AvatarState, type Gender, type VisualStyle, defaultAvatarState, isThematicStyle } from '@/lib/avatar-config';

interface AvatarStore {
  gender: Gender | null;
  state: Omit<AvatarState, 'gender'>;
  setGender: (g: Gender) => void;
  updateField: <K extends keyof Omit<AvatarState, 'gender'>>(key: K, value: AvatarState[K]) => void;
  toggleMultiField: (key: 'features' | 'clothing', id: string) => void;
  setVisualStyle: (style: VisualStyle) => void;
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
      setVisualStyle: (style) =>
        set((s) => {
          const wasThematic = isThematicStyle(s.state.visualStyle);
          const nowThematic = isThematicStyle(style);
          return {
            state: {
              ...s.state,
              visualStyle: style,
              // Clear environment fields when switching between thematic/real
              ...(wasThematic !== nowThematic ? {
                environment: nowThematic ? '' : 'modern-living',
                thematicEnvironment: nowThematic ? '' : '',
                customThematicEnv: '',
              } : {}),
            },
          };
        }),
      reset: () => set({ gender: null, state: { ...defaultAvatarState } }),
    }),
    { name: 'avatar-builder-state' }
  )
);
