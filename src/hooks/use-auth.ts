
"use client";

import { useLocalStorage } from "./use-local-storage";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const router = useRouter();

  const login = (email: string, role?: string) => {
    setUser({ email, role });
  };

  const logout = () => {
    setUser(null);
    router.push('/login'); // Redirect to login on logout
  };

  return { user, login, logout };
}
