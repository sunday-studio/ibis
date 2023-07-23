import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

function PortalImpl({ onClose, children, title, closeOnClickOutside, isDialog, className = '' }) {
  const modalRef = useRef(null);

  const propClassName = className ?? '';

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
      if (modalRef.current !== null && !modalRef.current.contains(target) && closeOnClickOutside) {
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
    <div className={`modal ${propClassName}`}>
      <div className="modal__overlay" role="dialog">
        <div className="modal__container" tabIndex={-1} ref={modalRef}>
          {isDialog ? (
            <div className="modal__content">
              <p className="modal__title">{title}</p>
              {children}
            </div>
          ) : (
            <div className="modal__content">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
  className,
  isDialog,
}) {
  return createPortal(
    <PortalImpl
      className={className}
      isDialog={isDialog}
      onClose={onClose}
      title={title}
      closeOnClickOutside={closeOnClickOutside}
    >
      {children}
    </PortalImpl>,
    document.body,
  );
}
