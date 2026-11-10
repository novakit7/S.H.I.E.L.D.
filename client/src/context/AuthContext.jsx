import { useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import AuthContext from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authService
      .getCurrentUser()
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser);
      })
      .catch((error) => {
        if (active && error.status !== 401) console.error(error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    return result.user;
  }, []);
  const signup = useCallback((details) => authService.register(details), []);
  const verifyOtp = useCallback(async (code, registrationToken) => {
    const result = await authService.verifyOtp(code, registrationToken);
    setUser(result.user);
    return result.user;
  }, []);
  const resendOtp = useCallback(
    (registrationToken) => authService.resendOtp(registrationToken),
    [],
  );
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);
  const updateUser = useCallback((nextUser) => setUser(nextUser), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signup,
      verifyOtp,
      resendOtp,
      login,
      logout,
      updateUser,
    }),
    [user, isLoading, signup, verifyOtp, resendOtp, login, logout, updateUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
