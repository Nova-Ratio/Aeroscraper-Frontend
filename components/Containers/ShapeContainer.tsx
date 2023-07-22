"use client"

import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ShapeIcon } from '@/components/Icons/Icons'
import { motion } from 'framer-motion'

type Props = {
  width?: string,
  height?: string,
  className?: string,
  containerClassName?: string
  layoutId?: string
  hasAnimation?: boolean
}

const ShapeContainer: React.FC<PropsWithChildren<Props>> = ({
  width = "w-[300px]",
  height = "h-[300px]",
  children,
  className = "",
  containerClassName = "",
  layoutId,
  hasAnimation = false
}
) => {

  return (
    <motion.div layoutId={layoutId} className={`relative ${width} ${height} ${className}`}>
      <ShapeIcon animate={hasAnimation}/>
      <div className={`absolute top-[28%] left-[28%] right-[20%] h-[55%] ${containerClassName}`}>
        {children}
      </div>
    </motion.div>
  )
}

export default ShapeContainer