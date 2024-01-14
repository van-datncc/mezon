import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useChat } from '@mezon/core';

const GoogleButtonLogin: React.FC = () => {
  const { loginByGoogle } = useChat();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse: any) => {
      await loginByGoogle(codeResponse.code);
    },

    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div className="flex items-center justify-center dark:bg-gray-800">
      <button
        onClick={googleLogin}
        className="w-full px-4 py-2 border flex gap-2 justify-center
         border-slate-200 dark:border-slate-700 rounded-lg
          text-slate-700 dark:text-slate-200 hover:border-slate-400
           dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
      >
        <img
          className="w-6 h-6"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default GoogleButtonLogin;
