import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/features/auth/components/auth-form";
import { authApi } from "@/features/auth/api/auth-api";
import { useAuth } from "@/app/store/auth-context";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must have at least 3 characters."),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must have at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

function FieldError({ message }) {
  if (!message) return null;
  return <small className="error">{message}</small>;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: (payload) => {
      loginSuccess(payload);
      toast.success("Registration successful.");
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      const responseData = error.response?.data;
      if (responseData && typeof responseData === "object") {
        const firstError = responseData.error || Object.values(responseData)[0];
        toast.error(firstError ?? "Registration failed.");
      } else {
        toast.error("Registration failed.");
      }
    },
  });

  return (
    <AuthForm
      title="Create account"
      subtitle="Join Street Alert and get notified on high-impact market events."
      onSubmit={form.handleSubmit((values) =>
        mutation.mutate({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      )}
      submitLabel="Register"
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkTo="/login"
      isSubmitting={mutation.isPending}
    >
      <label className="label">
        <span>Username</span>
        <input type="text" {...form.register("username")} />
        <FieldError message={form.formState.errors.username?.message} />
      </label>
      <label className="label">
        <span>Email</span>
        <input type="email" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </label>
      <label className="label">
        <span>Password</span>
        <input type="password" {...form.register("password")} />
        <FieldError message={form.formState.errors.password?.message} />
      </label>
      <label className="label">
        <span>Confirm password</span>
        <input type="password" {...form.register("confirmPassword")} />
        <FieldError message={form.formState.errors.confirmPassword?.message} />
      </label>
    </AuthForm>
  );
}
