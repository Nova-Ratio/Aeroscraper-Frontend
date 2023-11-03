import { motion } from 'framer-motion';
import React, { Dispatch, FC, useState } from 'react';
import BorderedContainer from './Containers/BorderedContainer';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string
}

const Checkbox: FC<CheckboxProps> = ({ label, checked, onChange, className }) => {

  const variants = {
    checked: {
      scale: 1.1,
      backgroundColor: '#D43752',
      borderColor: '#D43752',
    },
    unchecked: {
      scale: 1,
      backgroundColor: '#E5E7EB',
      borderColor: '#E5E7EB',
    },
  };

  return (
    <label onClick={onChange} className={`inline-flex items-center cursor-pointer ${className}`}>
      <div>
        <motion.div
          className="w-5 h-5 border-6 rounded-full cursor-pointer p-1"
          variants={variants}
          initial={checked ? 'checked' : 'unchecked'}
          animate={checked ? 'checked' : 'unchecked'}
          />
      </div>
      <span className="ml-2 text-ghost-white font-medium leading-7 text-2xl checkbox-label">{label}</span>
    </label>
  );
};

export default Checkbox;
