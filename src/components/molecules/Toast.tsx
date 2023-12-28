import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  isVisible: boolean;
  message: string;
}

const Toast: React.FC<ToastProps> = ({ isVisible, message }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-3 rounded"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
