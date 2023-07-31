'use client'

import { motion } from "framer-motion"
import { FC } from "react"

export const TowerAnimation: FC = () => {

  return (
    <div className="absolute left-0 bottom-0">
      <TowerPrimaryIcon />
      <TowerSecondaryIcon />
    </div>
  )
}

const TowerPrimaryIcon: React.FC = () => {
  return (
    <svg width="123" height="155" viewBox="0 0 123 155" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.931 154.039C20.0445 154.039 25.817 148.267 25.817 141.163C25.817 135.75 39.3735 125.828 61.511 125.828C83.6582 125.828 97.2148 135.75 97.2148 141.163C97.2148 148.267 102.987 154.039 110.101 154.039C117.205 154.039 122.977 148.267 122.977 141.163C122.977 121.086 102.482 104.789 74.397 100.931V14.5769C74.397 7.4731 68.6246 0 61.511 0C54.4072 0 48.6347 7.4731 48.6347 14.5769V100.94C20.5499 104.789 0.0546998 121.086 0.0546998 141.173C0.0449818 148.276 5.81745 154.039 12.931 154.039Z" fill="url(#paint0_linear_859_1687)" />
      <defs>
        <linearGradient id="paint0_linear_859_1687" x1="92.748" y1="1.31345" x2="-13.9803" y2="221.226" gradientUnits="userSpaceOnUse">
          <stop stop-color="#56235C" />
          <stop offset="0.294825" stop-color="#D43752" />
          <stop offset="0.402713" stop-color="#E4462D" />
          <stop offset="0.638994" stop-color="#F8B810" />
          <stop offset="0.827343" stop-color="#29499C" />
          <stop offset="1" stop-color="#2C3384" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const TowerSecondaryIcon: React.FC = () => {
  return (
    <motion.svg initial={{ scale: 0.6 }} animate={{ scale: 1 }} width="128" height="51" viewBox="0 0 128 51" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.931 50.4731C19.9473 50.4731 25.6518 44.8755 25.8072 37.898C27.2844 34.4385 40.6368 25.7992 63.5323 25.7992C86.4375 25.7992 99.7803 34.4385 101.267 37.898C101.432 44.8755 107.137 50.4731 114.143 50.4731C121.247 50.4731 127.02 44.7006 127.02 37.5968C127.02 16.538 99.1389 0.0466309 63.5323 0.0466309C27.9452 0.0466309 0.0546998 16.538 0.0546998 37.5968C0.0449818 44.7103 5.8077 50.4731 12.931 50.4731Z" fill="url(#paint0_linear_859_1874)" />
      <defs>
        <linearGradient id="paint0_linear_859_1874" x1="95.7965" y1="0.476605" x2="82.4311" y2="87.3681" gradientUnits="userSpaceOnUse">
          <stop stop-color="#56235C" />
          <stop offset="0.294825" stop-color="#D43752" />
          <stop offset="0.402713" stop-color="#E4462D" />
          <stop offset="0.638994" stop-color="#F8B810" />
          <stop offset="0.827343" stop-color="#29499C" />
          <stop offset="1" stop-color="#2C3384" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}