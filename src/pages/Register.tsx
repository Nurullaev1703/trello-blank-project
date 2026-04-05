import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockIcon,
  EnvelopeSimpleIcon,
  UserPlusIcon,
} from "@phosphor-icons/react";
import { useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiService } from "@/services/apiService";

interface FormTypes {
  username: string;
  email: string;
  password: string;
}

export const Register: FC = () => {
  const { control, handleSubmit } = useForm<FormTypes>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: FormTypes) => {
    setIsLoading(true);
    const response = await apiService.post({
      url: "/v1/auth/signup",
      dto: data
    });  
    if (response.statusCode !== 201) {
      error(response.message)
    }
    else {
      success(response.message)
      navigate({to:"/auth"})
    }
    setIsLoading(false)
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        className="flex flex-col gap-5 rounded-2xl p-6 border border-gray-200 w-96 bg-white/10 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-1">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
            <UserPlusIcon size={28} weight="fill" className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">Create account</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign up to get started with the platform
          </p>
        </div>

        {/* Username */}
        <Controller
          name="username"
          control={control}
          rules={{
            required: "This field is required",
            validate: (value) =>
              value.length > 4 || "Username must be more than 4 characters",
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: "Username must contain only Latin letters",
            },
          }}
          render={({ field, fieldState: { error: fieldError } }) => (
            <div className="relative">
              <Input
                {...field}
                error={!!fieldError}
                helperText={fieldError?.message}
                placeholder="Username"
                variant="outlined"
                className="pl-10"
              />
              <UserIcon
                size={18}
                weight="fill"
                className="absolute top-3.5 left-3 text-muted-foreground pointer-events-none"
              />
            </div>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "This field is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Enter a valid email address",
            },
          }}
          render={({ field, fieldState: { error: fieldError } }) => (
            <div className="relative">
              <Input
                {...field}
                error={!!fieldError}
                helperText={fieldError?.message}
                placeholder="Email"
                type="email"
                variant="outlined"
                className="pl-10"
              />
              <EnvelopeSimpleIcon
                size={18}
                weight="fill"
                className="absolute top-3.5 left-3 text-muted-foreground pointer-events-none"
              />
            </div>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          rules={{
            required: "This field is required",
            validate: (value) =>
              value.length >= 6 || "Password must be at least 6 characters",
          }}
          render={({ field, fieldState: { error: fieldError } }) => (
            <div className="relative">
              <Input
                {...field}
                error={!!fieldError}
                helperText={fieldError?.message}
                placeholder="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
              />
              <LockIcon
                size={18}
                weight="fill"
                className="absolute top-3.5 left-3 text-muted-foreground pointer-events-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute p-2.5 right-0.5 top-0.5 hover:bg-white/10 rounded-r-xl transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon
                    size={18}
                    weight="fill"
                    className="text-muted-foreground"
                  />
                ) : (
                  <EyeIcon
                    size={18}
                    weight="fill"
                    className="text-muted-foreground"
                  />
                )}
              </button>
            </div>
          )}
        />

        <Button type="submit" className="w-full mt-1" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth"
            className="text-primary underline font-medium hover:text-primary/80 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
