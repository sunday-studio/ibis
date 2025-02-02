import { useCallback, useMemo, useState } from 'react';

export interface UseModal {
  isModalOpen: boolean;
  handleShow: () => void;
  handleHide: () => void;
}

export const useModal = (defaultState = false): UseModal => {
  const [isModalOpen, setIsModalOpen] = useState(defaultState);

  const handleShow = useCallback(() => setIsModalOpen(true), []);
  const handleHide = useCallback(() => setIsModalOpen(false), []);

  return useMemo(
    () => ({ isModalOpen, handleShow, handleHide }),
    [isModalOpen, handleShow, handleHide],
  );
};
