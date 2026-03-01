import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useInternetIdentity } from "./useInternetIdentity";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoggingIn: boolean;
  userName: string;
  setUserName: (name: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { login, clear, identity, isLoggingIn, isLoginSuccess } =
    useInternetIdentity();
  const [userName, setUserName] = useState<string>("");

  const isAuthenticated = isLoginSuccess || !!identity;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout: clear,
        isLoggingIn,
        userName,
        setUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
