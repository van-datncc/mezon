import { LoginForm, LoginFormPayload } from '@mezon/components';
import { useChat } from '@mezon/core';
import React, { useEffect, useState } from 'react';
import { Loading } from 'libs/ui/src/lib/Loading';
import logoSVG from '../../../../../../src/assets/logo/MEZN.svg';
import * as Yup from 'yup';

function Login() {
  const { loginDevice, loginEmail } = useChat();

  const [showLoading, setShowLoading] = useState(true);

  const handleSubmit = React.useCallback(
    async (values: LoginFormPayload) => {
      try {
        await loginEmail(values.userEmail, values.password);
      } catch (error) {
        console.error(error);
      }
    },
    [loginEmail]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoading(false);
    }, 500);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 h-full">
        {showLoading && <Loading />}
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className=" w-32 mr-2" src={logoSVG} alt="logo" />
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <LoginForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
