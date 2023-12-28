import React from "react";
import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="GT-btn__secondary mr-2">
            Cancel
          </button>
          <button onClick={onConfirm} className="GT-btn__primary">
            OK
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
