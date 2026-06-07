import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "admin" | "supervisor" | "qa_manager" | "operator";

export interface AuthUser {
  email: string;
  role: UserRole;
  loginTime: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const sessionData = localStorage.getItem("auth_session");
    if (sessionData) {
      try {
        const parsedUser = JSON.parse(sessionData);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("auth_session");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem("auth_session", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_session");
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
