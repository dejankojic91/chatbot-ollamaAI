import { createContext, useContext, ReactNode, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";

interface AuthContextType {
    user: string | null;
    login: (data: { email: string, password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const token = localStorage.getItem("accessToken");
            console.log('Token', token)
            if (!token) {
                throw new Error("No token found");
            }
            const response = await api.get("/auth/user");
            return response.data;
        },
        enabled: !!localStorage.getItem("accessToken"), 
        retry: false,
        staleTime: 1000 * 60 * 5,
    });


    const loginMutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await api.post("/auth/login", data);
            localStorage.setItem("accessToken", response.data.accessToken);
            api.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post("/auth/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["authUser"], null);
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        },
    });

    useEffect(() => {
        const handleStorageChange = () => {
            if (!localStorage.getItem("accessToken")) {
                console.warn("Token removed. Redirecting to login...");
                window.location.href = "/login";
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);


    return (
        <AuthContext.Provider value={{ user, login: loginMutation.mutateAsync, logout: logoutMutation.mutate }}>
            {isLoading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
