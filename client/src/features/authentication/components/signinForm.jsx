import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "../hooks/useSignIn";
import { Button, Card, FormInput } from "../../../components/ui";

const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export default function SigninForm() {
  const signIn = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signinSchema) });

  const onSubmit = async (data) => {
    await signIn.resolve(data);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            register={register}
            error={errors.email}
            disabled={signIn.isLoading}
          />

          <div>
            <FormInput
              name="password"
              type="password"
              label="Password"
              placeholder="********"
              register={register}
              error={errors.password}
              disabled={signIn.isLoading}
            />
            <label className="label">
              <a
                href="/forgot-password"
                className="label-text-alt link link-hover"
              >
                Forgot password?
              </a>
            </label>
          </div>

          {signIn.isError && (
            <p className="label-text-alt text-error">{signIn.error.title}</p>
          )}

          <div className="form-control mt-6">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={signIn.isLoading}
              loading={signIn.isLoading}
            >
              Sign In
            </Button>
          </div>
        </form>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="link link-primary">
            Sign up
          </a>
        </p>
      </div>
    </Card>
  );
}
