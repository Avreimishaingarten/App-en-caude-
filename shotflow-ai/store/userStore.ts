import { create } from 'zustand';
import { User, SubscriptionTier, SubscriptionLimits, SUBSCRIPTION_LIMITS } from '../types';

interface UserState {
  user: User | null;
  hasCompletedOnboarding: boolean;
  usageThisSession: {
    cleanupActions: number;
    enhancements: number;
  };

  setUser: (user: User | null) => void;
  completeOnboarding: () => void;
  getTier: () => SubscriptionTier;
  getLimits: () => SubscriptionLimits;
  canPerformCleanup: () => boolean;
  canPerformEnhancement: () => boolean;
  incrementCleanupUsage: () => void;
  incrementEnhancementUsage: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  hasCompletedOnboarding: false,
  usageThisSession: { cleanupActions: 0, enhancements: 0 },

  setUser: (user) => set({ user }),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  getTier: () => get().user?.subscription.tier ?? 'free',

  getLimits: () => SUBSCRIPTION_LIMITS[get().getTier()],

  canPerformCleanup: () => {
    const { usageThisSession } = get();
    const limits = get().getLimits();
    return usageThisSession.cleanupActions < limits.maxCleanupActions;
  },

  canPerformEnhancement: () => {
    const { usageThisSession } = get();
    const limits = get().getLimits();
    return usageThisSession.enhancements < limits.maxEnhancements;
  },

  incrementCleanupUsage: () =>
    set((s) => ({
      usageThisSession: {
        ...s.usageThisSession,
        cleanupActions: s.usageThisSession.cleanupActions + 1,
      },
    })),

  incrementEnhancementUsage: () =>
    set((s) => ({
      usageThisSession: {
        ...s.usageThisSession,
        enhancements: s.usageThisSession.enhancements + 1,
      },
    })),
}));
