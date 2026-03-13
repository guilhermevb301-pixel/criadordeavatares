import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AvatarState, type Gender, type VisualStyle, defaultAvatarState, isThematicStyle, getPersonalitySubBlocks, appearanceSubBlocks, artStyles } from '@/lib/avatar-config';

interface AvatarStore {
  gender: Gender | null;
  state: Omit<AvatarState, 'gender'>;
  setGender: (g: Gender) => void;
  updateField: <K extends keyof Omit<AvatarState, 'gender'>>(key: K, value: AvatarState[K]) => void;
  toggleMultiField: (key: 'features' | 'clothing' | 'piercingsTattoos', id: string) => void;
  setVisualStyle: (style: VisualStyle) => void;
  randomize: () => void;
  reset: () => void;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomMulti<T>(arr: T[], max = 3): T[] {
  const count = Math.floor(Math.random() * max) + 1;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
          const arr = Array.isArray(s.state[key]) ? (s.state[key] as string[]) : [];
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
              ...(wasThematic !== nowThematic ? {
                environment: nowThematic ? '' : 'modern-living',
                thematicEnvironment: nowThematic ? '' : '',
                customThematicEnv: '',
              } : {}),
            },
          };
        }),
      randomize: () =>
        set((s) => {
          const gender = (s as any).gender || 'masculino';
          const personalitySubBlocks = getPersonalitySubBlocks(gender);
          const skinOpts = appearanceSubBlocks.skinTone.options;
          const eyeOpts = appearanceSubBlocks.eyeColor.options;
          const hairColorOpts = appearanceSubBlocks.hairColor.options;
          const hairTypeOpts = appearanceSubBlocks.hairType.options;
          const featureOpts = appearanceSubBlocks.features.options;
          const faceOpts = personalitySubBlocks.faceShape.options;
          const hairCutOpts = personalitySubBlocks.hairCut.options;
          const exoticOpts = personalitySubBlocks.exoticHairColor.options;
          const beardOpts = personalitySubBlocks.beardStyle.options;
          const glassOpts = personalitySubBlocks.glassesStyle.options;
          const piercOpts = personalitySubBlocks.piercingsTattoos.options;
          const makeupOpts = personalitySubBlocks.makeupStyle.options;

          return {
            state: {
              ...s.state,
              age: Math.floor(Math.random() * 55) + 18,
              skinTone: pickRandom(skinOpts).id,
              eyeColor: pickRandom(eyeOpts).id,
              hairColor: pickRandom(hairColorOpts).id,
              hairType: pickRandom(hairTypeOpts).id,
              features: pickRandomMulti(featureOpts, 2).map(o => o.id),
              faceShape: pickRandom(faceOpts).id,
              hairCut: pickRandom(hairCutOpts).id,
              exoticHairColor: Math.random() > 0.7 ? pickRandom(exoticOpts).id : '',
              beardStyle: gender === 'masculino' ? pickRandom(beardOpts).id : '',
              glassesStyle: Math.random() > 0.6 ? pickRandom(glassOpts).id : 'none',
              piercingsTattoos: Math.random() > 0.5 ? pickRandomMulti(piercOpts, 2).map(o => o.id) : [],
              makeupStyle: Math.random() > 0.5 ? pickRandom(makeupOpts).id : 'none',
              artStyle: pickRandom(artStyles).id,
            },
          };
        }),
      reset: () => set({ gender: null, state: { ...defaultAvatarState } }),
    }),
    {
      name: 'avatar-builder-state',
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<AvatarStore>) || {};
        const persistedInnerState = (persisted.state as Partial<AvatarState>) || {};

        return {
          ...currentState,
          ...persisted,
          state: {
            ...defaultAvatarState,
            ...currentState.state,
            ...persistedInnerState,
            features: Array.isArray(persistedInnerState.features)
              ? persistedInnerState.features
              : defaultAvatarState.features,
            clothing: Array.isArray(persistedInnerState.clothing)
              ? persistedInnerState.clothing
              : defaultAvatarState.clothing,
            piercingsTattoos: Array.isArray(persistedInnerState.piercingsTattoos)
              ? persistedInnerState.piercingsTattoos
              : defaultAvatarState.piercingsTattoos,
          },
        } as AvatarStore;
      },
    }
  )
);
