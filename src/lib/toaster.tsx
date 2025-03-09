import { FC } from 'react';

import clsx from 'clsx';
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning';
}

const CustomToaster: FC<ToastProps> = ({ title, type }) => {
  return (
    <div
      className={clsx(
        'py-1.5 px-3 ring-inset ring-3 ring-neutral-600 rounded-full bg-neutral-700 text-neutral-50 ',
        {
          'ring-red-600 bg-red-700': type === 'error',
          'ring-yellow-600 bg-yellow-700': type === 'warning',
        },
      )}
    >
      <p className="text-md font-light">{title}</p>
    </div>
  );
};

export const toaster = (toast: Omit<ToastProps, 'id'>) => {
  return sonnerToast.custom((id) => {
    return (
      <CustomToaster
        id={id}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
    );
  });
};
