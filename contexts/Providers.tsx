"use client";

import React, { FC, PropsWithChildren } from "react";
import AppProvider from "@/contexts/AppProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import ProfileProvider from "./ProfileProvider";
import PriceProvider from "./PriceProvider";
import DashboardProvider from "./DashboardProvider";
import BalanceProvider from "./BalanceProvider";
import TabsProvider from "./TabsProvider";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PriceProvider>
        <AppProvider>
          <NotificationProvider>
            <ProfileProvider>
              <BalanceProvider>
                <DashboardProvider>
                  <TabsProvider>
                    {children}
                  </TabsProvider>
                </DashboardProvider>
              </BalanceProvider>
            </ProfileProvider>
          </NotificationProvider>
        </AppProvider>
      </PriceProvider>
  );
};

export default Providers;
