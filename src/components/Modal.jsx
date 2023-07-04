import './Modal.css';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function PortalImpl({ onClose, children, title, closeOnClickOutside }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement = null;
    const handler = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    const clickOutsideHandler = (event) => {
      const target = event.target;
      if (
        modalRef.current !== null &&
        !modalRef.current.contains(target) &&
        closeOnClickOutside
      ) {
        onClose();
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener('click', clickOutsideHandler);
      }
    }

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div className="Modal__overlay" role="dialog">
      <div className="Modal__modal" tabIndex={-1} ref={modalRef}>
        <button
          className="Modal__closeButton"
          aria-label="Close modal"
          type="button"
          onClick={onClose}
        >
          <X size={18} color="red" />
        </button>

        <div className="Modal__content">{children}</div>
      </div>
    </div>
  );
}

export default function Modal({ onClose, children, title, closeOnClickOutside = false }) {
  return createPortal(
    <PortalImpl onClose={onClose} title={title} closeOnClickOutside={closeOnClickOutside}>
      {children}
    </PortalImpl>,
    document.body,
  );
}
