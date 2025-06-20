import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import logo from "@/assets/aryonlogo.png";
import { Input } from "@/components/ui/input";
import httpRequest  from "@/lib/httpsRequest";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserAuthAction } from "@/context/user/user-reducer";
import { useUserAuthContext } from "@/context/user/user-hooks";
import toast from "react-hot-toast";
import { handleErrorMessage } from "@/lib/errorhandler";

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

  const navigate = useNavigate();
  const { dispatch } = useUserAuthContext();
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
      dispatch({
        type: UserAuthAction.SET_TOKEN as keyof typeof UserAuthAction,
        payload: response?.data?.token,
      });
      navigate("/recommendations");
    } catch (error) {
      console.error('Login error:', error);
      toast.error(handleErrorMessage(error), {
        position: 'top-right',
        style: {
          backgroundColor: '#f8d7da',
          color: '#721c24',
        }
      });
    }
  };

    return (
    <div className={cn("min-h-screen flex flex-col bg-primary-foreground justify-center items-center gap-6 py-8")}>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
            <div className="p-1 rounded-sm bg-teal-50 mx-auto mb-5">
                <img src={logo} alt="Aryon Logo" className="w-12 h-12 object-cover" />
            </div>
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm;
