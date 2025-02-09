import React, { FC, PropsWithChildren } from 'react';
import {
  DialogProps,
  ModalOverlay,
  Dialog as RACDialog,
  Modal as RACModal,
} from 'react-aria-components';
import { XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Button } from './Button';

export interface ModalProps extends PropsWithChildren<DialogProps> {
  isOpen: boolean;
  title: string;
  footerActions: React.ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export type SubModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>;

const overlayStyles = tv({
  base: 'fixed top-0 left-0 w-full h-full isolate z-20 bg-black/[15%] flex items-center justify-center p-4 text-center backdrop-blur-sm',
  variants: {
    isEntering: {
      true: 'animate-in fade-in duration-200 ease-out',
    },
    isExiting: {
      true: 'animate-out fade-out duration-200 ease-in',
    },
  },
});

const modalStyles = tv({
  base: 'w-full max-w-md max-h-full rounded-xl bg-white forced-colors:bg-[Canvas] text-left align-middle text-slate-700 shadow-2xl bg-clip-padding',
  variants: {
    isEntering: {
      true: 'animate-in zoom-in-105 ease-out duration-200',
    },
    isExiting: {
      true: 'animate-out zoom-out-95 ease-in duration-200',
    },
  },
});

export function Dialog(props: DialogProps) {
  return (
    <RACDialog
      {...props}
      className={twMerge(
        'outline p-6 [[data-placement]>&]:p-4 max-h-[inherit] overflow-auto relative',
        props.className,
      )}
    />
  );
}

export const Modal: FC<ModalProps> = ({
  children,
  title,
  footerActions,
  onClose,
  showCloseButton = true,
  ...props
}) => {
  return (
    <ModalOverlay {...props} className={overlayStyles}>
      <RACModal {...props} className={modalStyles}>
        <div className="flex items-center justify-between gap-2 p-4">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 cursor-pointer">
            <XIcon size={14} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-4 pt-0 pb-4 text-sm">{children}</div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-200">
          {showCloseButton && (
            <Button size="medium" variant="secondary" onPress={onClose}>
              Cancel
            </Button>
          )}
          {footerActions}
        </div>
      </RACModal>
    </ModalOverlay>
  );
};
