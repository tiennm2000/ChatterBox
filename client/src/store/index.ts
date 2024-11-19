import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './slices/auth-slice';

export const useAppStore = create<AuthSlice>()((...a) => ({
  ...createAuthSlice(...a),
}));
