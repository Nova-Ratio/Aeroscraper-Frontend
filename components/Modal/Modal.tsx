'use client';

import useOutsideHandler from "@/hooks/useOutsideHandler";
import { motion } from "framer-motion";
import { FunctionComponent, ReactElement, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ShapeContainer from "../Containers/ShapeContainer";
import Text from '@/components/Texts/Text';
import { CloseIcon } from "../Icons/Icons";


interface ModalProps {
  title?: string,
  children?: ReactElement,
  showModal: boolean,
  onClose?: () => void,
  modalSize?: "sm" | "md" | "lg"
}

export const Modal: FunctionComponent<ModalProps> = ({ modalSize = "lg", ...props }: ModalProps) => {

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window != 'undefined' && window.document && props.showModal) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [props.showModal]);

  useEffect(() => {
    const listenerKeydown = (e: any) => {
      if (e.code === "Esc") {
        closeModal();
      }
    }
    document.addEventListener('keydown', listenerKeydown);
    return () => {
      document.removeEventListener("keydown", listenerKeydown);
    }
  }, []);

  const closeModal = () => {
    props.onClose?.();
  }

  useOutsideHandler(ref, closeModal);

  if (!props.showModal) return null;

  //#endregion

  return ReactDOM.createPortal(
    <div className="inset-0 fixed flex items-center justify-center px-2 z-50">
      <motion.div
        ref={ref}
        initial={{ scale: 0.85, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 900,
          damping: 25,
        }}
        className={`z-[60]`}>
        <ShapeContainer width='w-[1140px]' height='h-[1100px]'>
          <div className="w-1/2 absolute -top-16 flex justify-between">
            <Text size="2xl">{props.title}</Text>
            <button onClick={closeModal}>
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          {props.children}
        </ShapeContainer>
      </motion.div>
      <div className="bg-gray-900 bg-opacity-40 inset-0 fixed z-60"></div>
    </div>
    , document.body);
};

