import { create } from 'zustand';
import { CleanupSession, MediaGroup } from '../types';
import { CleanupPlan, buildCleanupPlan, executeCleanup } from '../features/cleanup';

interface CleanupState {
  plan: CleanupPlan | null;
  overrides: Map<string, string>;
  isExecuting: boolean;
  lastSession: CleanupSession | null;
  error: string | null;

  buildPlan: (groups: MediaGroup[]) => void;
  overrideKeep: (groupId: string, keepId: string) => void;
  execute: () => Promise<void>;
  reset: () => void;
}

export const useCleanupStore = create<CleanupState>((set, get) => ({
  plan: null,
  overrides: new Map(),
  isExecuting: false,
  lastSession: null,
  error: null,

  buildPlan: (groups) => {
    const plan = buildCleanupPlan(groups, get().overrides);
    set({ plan });
  },

  overrideKeep: (groupId, keepId) => {
    const overrides = new Map(get().overrides);
    overrides.set(groupId, keepId);
    set({ overrides });

    // Rebuild plan with new overrides
    if (get().plan) {
      const plan = buildCleanupPlan(get().plan!.groups, overrides);
      set({ plan });
    }
  },

  execute: async () => {
    const { plan } = get();
    if (!plan) return;

    set({ isExecuting: true, error: null });
    try {
      const session = await executeCleanup(plan);
      set({ lastSession: session, isExecuting: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Cleanup failed',
        isExecuting: false,
      });
    }
  },

  reset: () => {
    set({ plan: null, overrides: new Map(), isExecuting: false, lastSession: null, error: null });
  },
}));
