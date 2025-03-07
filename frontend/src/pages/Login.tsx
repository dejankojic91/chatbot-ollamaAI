import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validation";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { isAxiosError } from "@/utils/errorHandler";


interface LoginForm {
    email: string
    password: string
}

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });


    const onSubmit = async (data: LoginForm) => {
        setIsLoggingIn(true);
        setServerError("");

        try {
            await login(data);
            navigate("/chat")
        } catch (error) {
            console.log(error)
            if (isAxiosError(error)) {
                setServerError(error?.response?.data?.message || error?.message || "Login failed");
            }
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card className="w-[400px] p-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign In</CardTitle>
                    <CardDescription>
                        Enter your email below to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <Input {...register("email")} type="email" placeholder="Email" />
                        {errors.email && <p className="rext-red-500">{errors.email.message}</p>}

                        <Input {...register("password")} type="password" placeholder="Password" />
                        {errors.password && <p className="rext-red-500">{errors.password.message}</p>}

                        {serverError && <p className="text-red-500">{serverError}</p>}

                        <Button type="submit" className="mt-2 w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? "Logging in..." : "Login"}
                        </Button>
               
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    )
}

export default Login