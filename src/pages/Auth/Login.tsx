import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAuthContext } from "@/context/user/user-hooks";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import httpRequest  from "@/lib/httpsRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {   

    const { user } = useUserAuthContext();
    console.log("user", user);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await httpRequest({ token: "" }).post(
                `/login`,
                data
            );

            console.log('Login response:', response.data);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
    <div className={cn("min-h-screen flex flex-col justify-center items-center gap-6 py-8")}>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Username</Label>
                    <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register("username")}
                    aria-invalid={!!errors.username}
                    />
                    {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Link
                    to="#"
                    className="ml-auto inline-block text-sm"
                  >
                    Forgot your password?
                  </Link>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm;
