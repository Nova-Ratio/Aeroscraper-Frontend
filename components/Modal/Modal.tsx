'use client';

import useOutsideHandler from "@/hooks/useOutsideHandler";
import { AnimatePresence, motion } from "framer-motion";
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
  modalSize?: "sm" | "md" | "lg",
  childrenClassName?: string
}

const SIZE_VARIANT = {
  'sm': {
    width: 'w-[660px]',
    height: 'h-[660px]',
  },
  'md': {
    width: 'w-[1140px]',
    height: 'h-[1100px]',
  },
  'lg': {
    width: 'w-[1140px]',
    height: 'h-[1100px]',
  }
}

const TITLE_SIZE_VARIANT: Record<string, 'lg' | 'base' | '2xl'> = {
  'sm': 'lg',
  'md': 'base',
  'lg': '2xl'
}

const TITLE_POSITION_VARIANT: Record<string, string> = {
  'sm': '-top-4',
  'md': 'base',
  'lg': '-top-16'
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
      <AnimatePresence>
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
          <ShapeContainer width={SIZE_VARIANT[modalSize].width} height={SIZE_VARIANT[modalSize].height}>
            <div className={`w-1/2 absolute flex justify-between ${TITLE_POSITION_VARIANT[modalSize]}`}>
              <Text size={TITLE_SIZE_VARIANT[modalSize]}>{props.title}</Text>
              <button onClick={closeModal}>
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <div className={`${props.childrenClassName}`}>
              {props.children}
            </div>
          </ShapeContainer>
        </motion.div>
      </AnimatePresence>
      <div className="bg-gray-900 bg-opacity-40 inset-0 fixed z-60"></div>
    </div>
    , document.body);
};

