import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockIcon,
  SignInIcon,
} from "@phosphor-icons/react";
import { useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiService } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";
import { tokenStorage } from "@/services/storageService";

interface FormTypes {
  username: string;
  password: string;
}

export const Login: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormTypes>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const { success, error } = useToast()
  

  const navigate = useNavigate();

  const login = async (data: FormTypes) => {
    const response = await apiService.post<{token:string}>({
      url: "/v1/auth/login",
      dto: data
    })
    if (response.statusCode === 201 || response.statusCode === 200) {
      success(response.message || "Successfully logged in")
      tokenStorage.setValue(response.data.token)
      apiService.saveBearerToken(response.data.token)
      navigate({to: "/"})
    }
    else {
      error(response.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        className="flex flex-col gap-5 rounded-2xl p-6 border border-gray-200 w-96 bg-white/10 shadow-lg"
        onSubmit={handleSubmit(login)}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-1">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
            <SignInIcon size={28} weight="fill" className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in to your account to continue
          </p>
        </div>

        {/* Username */}
        <Controller
          name="username"
          control={control}
          rules={{
            required: "This field is required",
            validate: (value) => {
              const regex = /^[A-Za-z]+$/
              if(value.length < 4)
                return "Username must be more than 4 characters";
              else if (!regex.test(value))
                return "Username contains only letters";
            }
          }}
          render={({ field, fieldState: { error } }) => (
            <div className="relative">
              <Input
                {...field}
                error={!!error}
                helperText={error?.message}
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

        {/* Password */}
        <Controller
          name="password"
          control={control}
          rules={{
            required: "This field is required",
            validate: (value) =>
              value.length > 4 || "Password must be more than 4 characters",
          }}
          render={({ field, fieldState: { error } }) => (
            <div className="relative">
              <Input
                {...field}
                error={!!error}
                helperText={error?.message}
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

        <Button type="submit" className="w-full mt-1" disabled={isSubmitting}>
          {isSubmitting ? "Waiting sign in" : "Sign In" }
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-primary underline font-medium hover:text-primary/80 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
