import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "../hooks/useSignUp";
import { Button, Card, FormInput } from "../../../components/ui";

const signupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export default function SignupForm() {
  const signUp = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    await signUp.resolve(data);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            name="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            register={register}
            error={errors.name}
            disabled={signUp.isLoading}
          />

          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            register={register}
            error={errors.email}
            disabled={signUp.isLoading}
          />

          <FormInput
            name="password"
            type="password"
            label="Password"
            placeholder="********"
            register={register}
            error={errors.password}
            disabled={signUp.isLoading}
          />

          {signUp.isError && (
            <p className="label-text-alt text-error">{signUp.error.title}</p>
          )}

          <div className="form-control mt-6">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={signUp.isLoading}
              loading={signUp.isLoading}
            >
              Sign Up
            </Button>
          </div>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/signin" className="link link-primary">
            Sign in
          </a>
        </p>
      </div>
    </Card>
  );
}
