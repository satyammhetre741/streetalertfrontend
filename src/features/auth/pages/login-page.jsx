import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/features/auth/components/auth-form";
import { authApi } from "@/features/auth/api/auth-api";
import { useAuth } from "@/app/store/auth-context";

const loginSchema = z.object({
  username: z.string().min(3, "Username is required."),
  password: z.string().min(8, "Password must have at least 8 characters."),
});

function FieldError({ message }) {
  if (!message) return null;
  return <small className="error">{message}</small>;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (payload) => {
      loginSuccess(payload);
      toast.success("Logged in successfully.");
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      const responseData = error.response?.data;
      if (responseData && typeof responseData === "object") {
        const firstError = responseData.error || Object.values(responseData)[0];
        toast.error(firstError ?? "Login failed.");
      } else {
        toast.error("Login failed.");
      }
    },
  });

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to access your personalized market intelligence."
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      submitLabel="Login"
      footerText="Don't have an account?"
      footerLinkText="Register"
      footerLinkTo="/register"
      isSubmitting={mutation.isPending}
    >
      <label className="label">
        <span>Username</span>
        <input type="text" {...form.register("username")} />
        <FieldError message={form.formState.errors.username?.message} />
      </label>
      <label className="label">
        <span>Password</span>
        <input type="password" {...form.register("password")} />
        <FieldError message={form.formState.errors.password?.message} />
      </label>
    </AuthForm>
  );
}
