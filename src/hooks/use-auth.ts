
"use client";

import { useLocalStorage } from "./use-local-storage";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role?: 'patient' | 'doctor' | 'asha' | 'pharmacy';
  age?: number;
  gender?: string;
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const router = useRouter();

  const login = (name: string, email: string, role?: 'patient' | 'doctor' | 'asha' | 'pharmacy', age?: number, gender?: string) => {
    setUser({ name, email, role, age, gender });
  };

  const logout = () => {
    setUser(null);
    router.push('/'); // Redirect to landing page on logout
  };

  return { user, login, logout };
}
