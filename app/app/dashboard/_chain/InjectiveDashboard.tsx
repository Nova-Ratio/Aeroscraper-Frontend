'use client';

import InjectiveStatisticSide from "../_components/Injective/InjectiveStatisticSide";
import InjectiveTabsSide from "../_components/Injective/InjectiveTabsSide";

export default function InjectiveDashboard() {

  return (
    <div className="flex gap-32">
      <InjectiveStatisticSide />
      <InjectiveTabsSide />
    </div>
  )
}