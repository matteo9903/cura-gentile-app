// Mock Authentication Service

export interface User {
  id: string;
  username: string;
  nome: string;
  cognome: string;
  email: string;
  avatar?: string;
}

const MOCK_USERS = [
  {
    id: "1",
    username: "mario.rossi",
    password: "password123",
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@email.it",
  },
  {
    id: "2",
    username: "demo",
    password: "demo",
    nome: "Utente",
    cognome: "Demo",
    email: "demo@iov.it",
  },
];

const AUTH_KEY = "iov_auth_user";

export const authService = {
  login: async (username: string, password: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }

    return null;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_KEY);
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock: always succeed if old password is not empty
    return oldPassword.length > 0 && newPassword.length >= 6;
  },
};
