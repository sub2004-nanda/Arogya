
"use client";

import { useLocalStorage } from "./use-local-storage";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role?: string;
  age?: number;
  gender?: string;
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const router = useRouter();

  const login = (name: string, email: string, role?: string, age?: number, gender?: string) => {
    setUser({ name, email, role, age, gender });
  };

  const logout = () => {
    setUser(null);
    router.push('/login'); // Redirect to login on logout
  };

  return { user, login, logout };
}
