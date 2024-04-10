import useChainAdapter from "@/hooks/useChainAdapter";
import { FC, PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePageData } from "./DashboardProvider";

export type DashboardTabs =
    | "faucet"
    | "trove"
    | "createTrove"
    | "stabilityPool"
    | "redeem"
    | "riskyTroves"
    | "rewards"
    | "leaderboard"
    /* | "missions"; */

type ProfileContextValue = {
    selectedTab: DashboardTabs;
    setSelectedTab: (arg: DashboardTabs) => void;
    isTroveOpened: boolean,
    tabList: DashboardTabs[]
}

const TabContext = createContext<ProfileContextValue>({
    selectedTab: "trove",
    setSelectedTab: () => { },
    isTroveOpened: false,
    tabList: []
});

const TabsProvider: FC<PropsWithChildren> = ({ children }) => {

    const [isTroveOpened, setIsTroveOpened] = useState(false);

    const [selectedTab, setSelectedTab] = useState<DashboardTabs>(
        isTroveOpened ? "trove" : "createTrove"
    );

    const { pageData } = usePageData();

    const { selectedChainName } = useChainAdapter();

    const tabList: DashboardTabs[] = useMemo(() => {
        let tempTablist: DashboardTabs[] = [
            isTroveOpened ? "trove" : "createTrove",
            "stabilityPool",
            "redeem",
            "riskyTroves",
            "rewards",
            "leaderboard",
            /* "missions", */
        ];
        
        return tempTablist;
    }, [isTroveOpened, selectedChainName]);

    useEffect(() => {
        setIsTroveOpened(pageData.baseCollateralAmount > 0);

        if (selectedTab === "trove" || selectedTab === "createTrove") {
            setSelectedTab(
                pageData.baseCollateralAmount > 0 ? "trove" : "createTrove"
            );
        }
    }, [pageData]);

    const value = useMemo<ProfileContextValue>(() => ({
        selectedTab,
        setSelectedTab,
        isTroveOpened,
        tabList
    }), [
        selectedTab,
        setSelectedTab,
        isTroveOpened,
        tabList
    ])

    return (
        <TabContext.Provider value={value}>
            {children}
        </TabContext.Provider>
    )
}

export const useTabs = () => useContext(TabContext);

export default TabsProvider;