import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../utils/validation";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

interface RegistrationForm {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
}
const Registration = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<RegistrationForm>({
        resolver: zodResolver(registerSchema)
    })

    const signUpMutation = useMutation({
        mutationFn: async (data: RegistrationForm) => {
            return api.post("/auth/register", data);
        },
        onSuccess: async (_, data) => {
            await login({ email: data.email, password: data.password })
            navigate("/chat");
        }
    })

    const onSubmit = (data: RegistrationForm) => {
        signUpMutation.mutate(data);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card className="p-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <Input {...register('firstName')} placeholder="First Name" />
                        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

                        <Input {...register('lastName')} placeholder="Last Name" />
                        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

                        <Input {...register('username')} placeholder="Username" />
                        {errors.username && <p className="text-red-500">{errors.username.message}</p>}

                        <Input {...register('email')} type="email" placeholder="Email" />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                        <Input {...register('password')} type="password" placeholder="Password" />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                        {signUpMutation.isError && (
                            <p className="text-red-500">
                                {(signUpMutation.error as any)?.response?.data?.message || "Registration failed"}
                            </p>
                        )}

                        <Button type="submit" className="mt-2 w-full" disabled={signUpMutation.isPending}>
                            {signUpMutation.isPending ? "Registering..." : "Register"}
                        </Button>

                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="underline underline-offset-4">
                                Sign in
                            </Link>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Registration