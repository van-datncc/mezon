import { BaseSyntheticEvent, useCallback } from "react";
import { useForm } from "react-hook-form";

export type LoginFormPayload = {
    username: string;
    password: string;
    remember: boolean;
}

type LoginFormProps = {
    onSubmit: (data: LoginFormPayload) => void;
};

function LoginForm(props: LoginFormProps) {
    const { onSubmit } = props;
    const {
        register,
        handleSubmit,
    } = useForm<LoginFormPayload>(
        { defaultValues: { username: '', password: '', remember: false } }
    );

    const submitForm = useCallback((data: LoginFormPayload) => {
        if(typeof onSubmit === 'function') {
            onSubmit(data);
        }
        return false;
    }, [onSubmit])

    const handleFormSubmit = useCallback((e: BaseSyntheticEvent) => {
        e.preventDefault();
        handleSubmit(submitForm)(e)
    }, [handleSubmit, submitForm])

    return (
        <form className="space-y-4 md:space-y-6" onSubmit={handleFormSubmit}>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input {...register('username')} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input {...register('password')} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input {...register('remember')}  id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
            </div>
            <div className="flex flex-col-reverse space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign in
                </button>
            </div>
        </form>
    );
}

export default LoginForm;