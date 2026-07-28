import { create } from 'zustand';
import { CameraState, AppMode, CameraPermissionStatus, LensPreset } from '../types/camera';

export const useCameraStore = create<CameraState>((set) => ({
  mode: 'person',
  setMode: (mode: AppMode) => set({ mode }),

  permissionStatus: 'not-determined',
  setPermissionStatus: (status: CameraPermissionStatus) => set({ permissionStatus: status }),

  activeLens: '1x',
  setActiveLens: (lens: LensPreset) => set({ activeLens: lens }),

  isAppActive: true,
  setIsAppActive: (active: boolean) => set({ isAppActive: active }),

  isFrozen: false,
  setIsFrozen: (frozen: boolean) => set({ isFrozen: frozen }),
}));
