import Text from "@/components/Texts/Text";
import React, { FC, useMemo, useState } from "react";
import Checkbox from "@/components/Checkbox";
import { CollateralAsset } from "@/types/types";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import { ChainName } from "@/enums/Chain";
import CreateTrovePanel from "../TrovePanels/CreateTrovePanel";
import CollateralPanel from "../TrovePanels/CollateralPanel";
import BorrowPanel from "../TrovePanels/BorrowPanel";
import { usePageData } from "@/contexts/DashboardProvider";
import { useAppContext } from "@/contexts/AppProvider";

enum TABS {
  COLLATERAL = 0,
  BORROWING,
}

const TroveTab: FC = () => {
  const { pageData } = usePageData();
  const { selectedChainName } = useAppContext();

  // The purpose of using useState instead of constant value is to store the selected asset for future on multi collateral feature
  const [selectedAsset] = useState<CollateralAsset>(DefaultAssetByChainName[selectedChainName ?? ChainName.HEDERA]);

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.COLLATERAL);

  const selectedCollateral = useMemo(() => {
    return (
      pageData.collateralAmountsByDenom[selectedAsset.denom] ?? {
        denom: selectedAsset.denom,
        amount: 0,
      }
    );
  }, [selectedAsset, pageData.collateralAmountsByDenom]);

  const isTroveOpened = useMemo(() => selectedCollateral.amount > 0, [selectedCollateral]);

  if (!isTroveOpened) {
    return (
      <div className="overflow-hidden md:overflow-visible">
        <CreateTrovePanel />
      </div>
    )
  }

  return (
    <div className="overflow-hidden md:overflow-visible">
      <Text size="3xl">Manage your collateral</Text>
      <Text size="base" weight="font-regular" className="mt-1">
        Mint aUSD or repay your debt.
      </Text>
      <div className="flex flex-col mt-8">
        <Checkbox
          label={"Collateral"}
          checked={selectedTab === TABS.COLLATERAL}
          onChange={() => {
            setSelectedTab(TABS.COLLATERAL);
          }}
        />
        {selectedTab === TABS.COLLATERAL && <CollateralPanel />}
        <Checkbox
          label={"Borrow/Repay"}
          checked={selectedTab === TABS.BORROWING}
          onChange={() => {
            setSelectedTab(TABS.BORROWING);
          }}
          className="mt-8"
        />
        {selectedTab === TABS.BORROWING && <BorrowPanel />}
      </div>
    </div>
  );
};

export default TroveTab;
