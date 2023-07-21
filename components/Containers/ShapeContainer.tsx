"use client"

import React, { PropsWithChildren } from 'react'
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
  hasAnimation
}
) => {
  console.log(hasAnimation);
  
  return (
    <motion.div layoutId={layoutId} className={`relative ${width} ${height} ${className}`}>
      <motion.svg viewBox="0 0 298 291" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_f_321_72)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M58.2798 117.842C64.6131 94.2298 49.3261 64.9341 65.1718 46.3174C80.802 27.954 109.979 25.9629 133.902 28.9964C155.5 31.7352 168.965 52.8675 188.735 61.9854C208.75 71.2165 237.363 64.6564 250.15 82.6096C262.851 100.441 248.392 125.075 249.251 146.95C250.174 170.438 264.51 194.106 255.381 215.766C245.911 238.234 224.812 258.382 200.716 262.108C176.86 265.796 157.579 243.923 135.436 234.311C119.572 227.425 104.36 221.578 89.0074 213.615C68.2667 202.857 36.6258 201.605 29.4879 179.358C22.4284 157.354 52.2934 140.161 58.2798 117.842Z" fill="url(#paint0_linear_321_72)" />
        </g>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M58.2798 117.842C64.6131 94.2298 49.3261 64.9341 65.1718 46.3174C80.802 27.954 109.979 25.9629 133.902 28.9964C155.5 31.7352 168.965 52.8675 188.735 61.9854C208.75 71.2165 237.363 64.6564 250.15 82.6096C262.851 100.441 248.392 125.075 249.251 146.95C250.174 170.438 264.51 194.106 255.381 215.766C245.911 238.234 224.812 258.382 200.716 262.108C176.86 265.796 157.579 243.923 135.436 234.311C119.572 227.425 104.36 221.578 89.0074 213.615C68.2667 202.857 36.6258 201.605 29.4879 179.358C22.4284 157.354 52.2934 140.161 58.2798 117.842Z" fill="url(#paint1_linear_321_72)" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M69.5542 126.286C75.2851 104.92 61.4523 78.4111 75.7906 61.5655C89.9339 44.949 116.335 43.1473 137.982 45.8922C157.526 48.3704 169.709 67.4924 187.599 75.743C205.71 84.0959 231.601 78.1598 243.172 94.4051C254.664 110.54 241.581 132.831 242.358 152.625C243.193 173.878 256.165 195.295 247.905 214.894C239.336 235.225 220.244 253.456 198.441 256.828C176.854 260.165 159.407 240.373 139.37 231.675C125.015 225.444 111.25 220.153 97.3587 212.948C78.5911 203.214 49.9602 202.081 43.5013 181.949C37.1134 162.039 64.1373 146.482 69.5542 126.286Z" fill="#1A0B1C" />
        <defs>
          <filter id="filter0_f_321_72" x="0.887627" y="0.309898" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="13.7637" result="effect1_foregroundBlur_321_72" />
          </filter>

          <linearGradient className={"shape-animation"} id="paint0_linear_321_72" x1="60.7876" y1="59.3647" x2="347.829" y2="305.873" gradientUnits="userSpaceOnUse">
            <stop stop-color="#56235C" />
            <stop offset="0.294825" stop-color="#D43752" />
            <stop offset="0.402713" stop-color="#E4462D" />
            <stop offset="0.638994" stop-color="#F8B810" />
            <stop offset="0.827343" stop-color="#29499C" />
            <stop offset="1" stop-color="#2C3384" />
          </linearGradient>
          <linearGradient className={"shape-animation"} id="paint1_linear_321_72" x1="60.7876" y1="59.3647" x2="347.829" y2="305.873" gradientUnits="userSpaceOnUse">
            <stop stop-color="#56235C" />
            <stop offset="0.294825" stop-color="#D43752" />
            <stop offset="0.402713" stop-color="#E4462D" />
            <stop offset="0.638994" stop-color="#F8B810" />
            <stop offset="0.827343" stop-color="#29499C" />
            <stop offset="1" stop-color="#2C3384" />
          </linearGradient>
        </defs>
      </motion.svg>
      <div className={`absolute top-[28%] left-[28%] right-[20%] h-[55%] ${containerClassName}`}>
        {children}
      </div>
    </motion.div>
  )
}

export default ShapeContainer