import React, { FC } from 'react';

type Props = {
  height: string,
  width?: string,
  color?: "bg-zaffre" | "bg-indigo"
}
const SkeletonLoading: FC<Props> = ({ height, width = "w-full", color = "bg-dark-silver" }) => {
  return (
    <div className="p-4 rounded-md animate-pulse">
      <div className={`${color} mb-2 rounded w-full ${height} ${width}`}></div>
    </div>
  );
};

export default SkeletonLoading;