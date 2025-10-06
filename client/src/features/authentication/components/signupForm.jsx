import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  UserPlus,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useSignUp } from "../hooks/useSignUp";
import { Button, Card, FormInput } from "../../../components/ui";

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupForm() {
  const signUp = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const watchedPassword = watch("password", "");
  
  const passwordStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" };
    if (password.length < 6) return { score: 1, text: "Weak", color: "text-error" };
    if (password.length < 8) return { score: 2, text: "Fair", color: "text-warning" };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { score: 4, text: "Strong", color: "text-success" };
    }
    return { score: 3, text: "Good", color: "text-info" };
  };

  const strength = passwordStrength(watchedPassword);

  const onSubmit = async (data) => {
    await signUp.resolve(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-200 p-4 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--p)/0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="shadow-2xl bg-base-100/95 backdrop-blur-xl border border-base-content/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-xl" />
          
          <div className="relative space-y-5 p-8">
            {/* Enhanced Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-primary to-primary-focus rounded-xl shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <UserPlus className="w-6 h-6 text-primary-content" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-primary/60" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-base-content/60 text-sm">
                Join us today and get started on your journey
              </p>
            </motion.div>

            <motion.form 
              className="space-y-4" 
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Name Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-base-content/80">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="John Doe"
                    disabled={signUp.isLoading}
                    className={`input input-bordered w-full pl-10 pr-4 bg-base-200/50 border-base-content/20 text-base-content placeholder-base-content/40 focus:border-primary focus:bg-base-100 transition-all duration-300 ${
                      errors.name ? "border-error focus:border-error" : ""
                    }`}
                  />
                  {!errors.name && watch("name")?.length >= 3 && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                  )}
                </div>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.name.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Email Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-base-content/80">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    disabled={signUp.isLoading}
                    className={`input input-bordered w-full pl-10 pr-4 bg-base-200/50 border-base-content/20 text-base-content placeholder-base-content/40 focus:border-primary focus:bg-base-100 transition-all duration-300 ${
                      errors.email ? "border-error focus:border-error" : ""
                    }`}
                  />
                  {!errors.email && watch("email")?.includes("@") && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                  )}
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-base-content/80">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    disabled={signUp.isLoading}
                    className={`input input-bordered w-full pl-10 pr-12 bg-base-200/50 border-base-content/20 text-base-content placeholder-base-content/40 focus:border-primary focus:bg-base-100 transition-all duration-300 ${
                      errors.password ? "border-error focus:border-error" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {watchedPassword && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-base-content/60">Password strength</span>
                      <span className={`text-xs font-medium ${strength.color}`}>
                        {strength.text}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            i <= strength.score
                              ? strength.score === 1
                                ? "bg-error"
                                : strength.score === 2
                                ? "bg-warning"
                                : strength.score === 3
                                ? "bg-info"
                                : "bg-success"
                              : "bg-base-content/10"
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Error Message */}
              {signUp.isError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="alert alert-error shadow-lg"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{signUp.error.title}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div 
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="btn btn-primary w-full gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  disabled={signUp.isLoading}
                >
                  {signUp.isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center pt-2 border-t border-base-content/10"
            >
              <p className="text-sm text-base-content/60">
                Already have an account?{" "}
                <a 
                  href="/signin" 
                  className="link link-primary font-semibold hover:link-hover transition-colors"
                >
                  Sign in
                </a>
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}