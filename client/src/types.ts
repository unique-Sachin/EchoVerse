export interface Entry {
  _id: string;
  title: string;
  mood: string;
  audioUrl: string;
  unlockAt: string;
  createdAt: string;
  isUnlocked: boolean;
} 

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

