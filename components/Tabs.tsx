import { camelCaseToTitleCase } from '@/utils/stringUtils';
import { motion } from 'framer-motion';
import React, { FC } from 'react';

interface TabsProps<T> {
  tabs: T[];
  selectedTab: T;
  onTabSelected?: (tab: any) => void;
}

const Tabs: FC<TabsProps<string>> = ({ tabs, selectedTab, onTabSelected }) => {
  return (
    <nav>
      <ul className='flex flex-auto gap-2 border border-white/10 rounded-lg'>
        {tabs.map((tab) => (
          <motion.li
            key={tab}
            onClick={() => onTabSelected && onTabSelected(tab)}
            className={`px-6 py-3 m-1 text-base font-medium text-white relative cursor-pointer rounded-md hover:text-red-500 duration-700`}
          >
            {camelCaseToTitleCase(tab)}
            {tab === selectedTab && <motion.div layoutId={"gliding"} className="absolute bottom-0 h-[48px] border rounded-md border-red-500 left-0 right-0" />}
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};

export default Tabs;
