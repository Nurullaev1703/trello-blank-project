import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface FormTypes{
    username: string, 
    password: string
}

export const Login: FC = () => {
    const { control, handleSubmit } = useForm<FormTypes>();
    // отображение пароля
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex min-h-screen items-center justify-center'>
        <form className='flex flex-col gap-4 rounded-2xl p-4 border border-gray-200 w-96 bg-white/10' onSubmit={handleSubmit(data => console.log(data))}>
            <h1 className='text-3xl font-bold text-center'>Login</h1>
            <Controller
                name='username'
                control={control}
                rules={{
                    required: "Поле обязательно",
                    validate: (value) => value.length > 4 || "Логин должен быть больше 4 символов"
                }}
                render={({field, fieldState: {error}}) => (
                    <Input {...field} 
                        error={!!error} 
                        helperText={error?.message} 
                        placeholder='Логин'
                        variant="outlined"
                    />
                )}
            />
            <Controller
                name='password'
                control={control}
                rules={{
                    required: "Поле обязательно",
                    validate: (value) => value.length > 4 || "Пароль должен быть больше 4 символов"
                }}
                render={({field, fieldState: {error}}) => (
                    <div className='relative'>
                        <Input {...field} 
                            error={!!error} 
                            helperText={error?.message} 
                            placeholder='Пароль'
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute p-3 right-0 top-0 hover:bg-white/10 rounded-r-xl'
                        >
                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </div>
                )}
            />
            <Button type='submit'>Войти</Button>
            <Link to='/auth/register' className='text-sm underline text-center'>Зарегистрироваться</Link>
        </form>
    </div>
  );
};

export default Login;