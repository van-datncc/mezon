import React from 'react';

interface AlertProps {
  description: string;
}

export const AlertTitleTextWarning: React.FC<AlertProps> = ({
  description,
}) => {
  return (
    <>
      <div
        className="w-full px-4 py-3 text-sm border-amber-100 bg-amber-50 text-amber-500"
        role="alert"
      >
        <p>{description}</p>
      </div>
    </>
  );
};
