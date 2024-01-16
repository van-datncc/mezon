import { LoginForm, LoginFormPayload } from '@mezon/components';
import { useChat } from '@mezon/core';
import React from 'react';
import { getMezonSession } from 'libs/utils/src/lib/storage/storage';
import { QRSection } from 'libs/components/src/lib/components/LoginForm/QR/index';
import { TitleSection } from 'libs/components/src/lib/components/LoginForm/Title/index';

function Login() {
  const { loginDevice, loginEmail } = useChat();

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

  return (
    <>
      <div
        className=" w-screen h-screen flex items-center justify-center"
        style={
          {
            background:
              'linear-gradient(219.23deg, #2970FF 1.49%, #8E84FF 43.14%, #E0D1FF 94.04%)',
          } as any
        }
      >
        <div className="flex-row justify-center items-center flex w-[850px] h-fit p-12 gap-x-12 rounded-2xl bg-[#0b0b0b]">
          <div className="flex-col justify-start items-center flex w-full h-fit p-0 gap-y-8">
            <TitleSection />
            <LoginForm onSubmit={handleSubmit} />
          </div>
          <QRSection />
        </div>
      </div>
    </>
  );
}

export default Login;
