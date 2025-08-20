import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingStore, UserData, ProfileSetupData, ContentSample, DeliveryPreferences, VoiceTrainingData } from '@/types/onboarding';
import { supabase } from '@/integrations/supabase/client';

const initialState = {
  currentStep: 1,
  userData: {},
  profileData: {
    industry: '',
    creatorType: '',
    platforms: [],
  },
  contentSamples: [],
  deliveryPrefs: {
    deliveryTime: '08:00',
    frequency: 'daily',
    channels: ['email'],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  voiceTraining: [],
  isLoading: false,
  error: undefined,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      updateUserData: (data) => 
        set((state) => ({ 
          userData: { ...state.userData, ...data } 
        })),

      updateProfileData: (data) => 
        set((state) => ({ 
          profileData: { ...state.profileData, ...data } 
        })),

      addContentSample: (sample) => 
        set((state) => ({ 
          contentSamples: [...state.contentSamples, sample] 
        })),

      removeContentSample: (id) => 
        set((state) => ({ 
          contentSamples: state.contentSamples.filter(s => s.id !== id) 
        })),

      updateDeliveryPrefs: (prefs) => 
        set((state) => ({ 
          deliveryPrefs: { ...state.deliveryPrefs, ...prefs } 
        })),

      updateVoiceTraining: (data) => 
        set((state) => {
          const existing = state.voiceTraining.findIndex(v => v.platform === data.platform);
          if (existing >= 0) {
            const updated = [...state.voiceTraining];
            updated[existing] = data;
            return { voiceTraining: updated };
          }
          return { voiceTraining: [...state.voiceTraining, data] };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      nextStep: () => 
        set((state) => ({ 
          currentStep: Math.min(state.currentStep + 1, 5) 
        })),

      prevStep: () => 
        set((state) => ({ 
          currentStep: Math.max(state.currentStep - 1, 1) 
        })),

      reset: () => set(initialState),

      saveProgress: async () => {
        const state = get();
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Persist partial profile progress
          if (state.profileData && (state.profileData.industry || state.profileData.creatorType)) {
            await supabase
              .from('creator_profiles')
              .update({
                industry: state.profileData.industry || null,
                creator_type: state.profileData.creatorType || null,
                platforms: state.profileData.platforms || [],
              })
              .eq('user_id', user.id);
          }

          // Optionally upsert delivery prefs draft
          if (state.deliveryPrefs) {
            await supabase
              .from('delivery_preferences')
              .upsert({
                user_id: user.id,
                delivery_time: state.deliveryPrefs.deliveryTime,
                frequency: state.deliveryPrefs.frequency,
                channels: state.deliveryPrefs.channels,
                timezone: state.deliveryPrefs.timezone,
              }, { onConflict: 'user_id' });
          }
        } catch (e) {
          // Swallow autosave errors silently
        }
      },

      completeOnboarding: async () => {
        const state = get();
        try {
          set({ isLoading: true });

          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('Not authenticated');
          }

          // 1) Update creator profile with onboarding selections
          await supabase
            .from('creator_profiles')
            .update({
              industry: state.profileData.industry || null,
              creator_type: state.profileData.creatorType || null,
              platforms: state.profileData.platforms || [],
              timezone: state.deliveryPrefs.timezone || null,
              onboarding_completed: true,
            })
            .eq('user_id', user.id);

          // 2) Insert content samples
          if (state.contentSamples.length > 0) {
            const inserts = state.contentSamples.map((s) => ({
              user_id: user.id,
              platform: s.platform,
              content: s.content,
              engagement_metrics: s.engagementMetrics || {},
            }));
            await supabase.from('content_samples').insert(inserts);
          }

          // 3) Upsert delivery preferences
          await supabase
            .from('delivery_preferences')
            .upsert({
              user_id: user.id,
              delivery_time: state.deliveryPrefs.deliveryTime,
              frequency: state.deliveryPrefs.frequency,
              channels: state.deliveryPrefs.channels,
              timezone: state.deliveryPrefs.timezone,
            }, { onConflict: 'user_id' });

          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to complete onboarding. Please try again.', isLoading: false });
        }
      },
    }),
    {
      name: 'creatorpulse-onboarding',
      partialize: (state) => ({
        currentStep: state.currentStep,
        userData: state.userData,
        profileData: state.profileData,
        contentSamples: state.contentSamples,
        deliveryPrefs: state.deliveryPrefs,
        voiceTraining: state.voiceTraining,
      }),
    }
  )
);