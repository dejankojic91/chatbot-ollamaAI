import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

const fetchChatHistory = async () => {
    const response = await axios.get("http://localhost:5000/api/chat/history", { withCredentials: true });
    return response.data.chats;
};


const items = [
    {
        title: "Home",
        url: "#",
        icon: '',
    },
    {
        title: "Inbox",
        url: "#",
        icon: '',
    },
    {
        title: "Calendar",
        url: "#",
        icon: '',
    },
    {
        title: "Search",
        url: "#",
        icon: '',
    },
    {
        title: "Settings",
        url: "#",
        icon: '',
    },
]
// { setMessages }: { setMessages: (messages: any) => void }
const AppSidebar = () => {
     const { user, login, logout } = useAuth();
    // const { user, logout } = useContext(AuthContext)!;
    const { data: history, isLoading, error } = useQuery({
        queryKey: ["chatHistory"],
        queryFn: async () => {
            // const response = await api.get("/history");
            return [];
        },
        enabled: !!user,
    });


    console.log(history)

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <Button onClick={logout}>Logout</Button>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            {/* <item.icon /> */}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;
