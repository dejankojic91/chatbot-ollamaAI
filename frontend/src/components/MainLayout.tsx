import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// { children }: { children: React.ReactNode }
const MainLayout = () => {
    const { user } = useAuth();

    if (user === null) {
        return <Navigate to="/login" replace />;
    }


    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <div className="flex-grow mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
                <Outlet /> 
            </div>
        </SidebarProvider>
    )
}

export default MainLayout