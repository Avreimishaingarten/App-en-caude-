import { create } from 'zustand';
import { ScanSession, MediaGroup, MediaItem } from '../types';
import { ScanProgress, runFullScan } from '../features/scanner';

interface ScanState {
  isScanning: boolean;
  progress: ScanProgress | null;
  session: ScanSession | null;
  error: string | null;

  startScan: () => Promise<void>;
  reset: () => void;
  getGroupsByType: (type: MediaGroup['type']) => MediaGroup[];
}

export const useScanStore = create<ScanState>((set, get) => ({
  isScanning: false,
  progress: null,
  session: null,
  error: null,

  startScan: async () => {
    set({ isScanning: true, progress: null, error: null });
    try {
      const session = await runFullScan((progress) => {
        set({ progress });
      });
      set({ session, isScanning: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Scan failed',
        isScanning: false,
      });
    }
  },

  reset: () => {
    set({ isScanning: false, progress: null, session: null, error: null });
  },

  getGroupsByType: (type) => {
    return get().session?.groups.filter((g) => g.type === type) ?? [];
  },
}));
