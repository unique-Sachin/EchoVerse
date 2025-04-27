export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Entry {
  _id: string;
  title: string;
  audioUrl: string;
  mood: string;
  unlockAt: string;
  createdAt: string;
  isUnlocked: boolean;
  user: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, token: string) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
} 