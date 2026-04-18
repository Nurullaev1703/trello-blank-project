import { createContext, useContext, ReactNode, FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "@/services/apiService";
import { tokenStorage, userStorage } from "@/services/storageService";
import { User } from "@/types/user";

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenStorage.deleteValue();
    userStorage.deleteValue();
    apiService.deleteBearerToken();
    queryClient.clear();
    navigate({ to: "/auth" });
  };

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      // If there's no token, we just throw to reach error state
      if (!tokenStorage.hasValue()) {
        throw new Error("No token found");
      }

      // Ensure bearer token is set
      apiService.saveBearerToken(tokenStorage.getValue());

      try {
        const response = await apiService.get<User>({ url: "/v1/auth/my" });
        if (response.statusCode >= 400 || !response.data) {
          throw new Error(response.message || "Failed to fetch profile");
        }
        userStorage.setValue(response.data);
        return response.data;
      } catch (err) {
        handleLogout();
        throw err;
      }
    },
    retry: 1, // Optional: retry once or handle differently
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: tokenStorage.hasValue(),
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isError,
        logout: handleLogout,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
