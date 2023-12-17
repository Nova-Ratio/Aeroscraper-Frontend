'use client';

import GradientButton from "@/components/Buttons/GradientButton";
import WalletButton from "@/components/Buttons/WalletButton";
import StatisticCard from "@/components/Cards/StatisticCard";
import BorderedContainer from "@/components/Containers/BorderedContainer";
import ShapeContainer from "@/components/Containers/ShapeContainer";
import { InfoIcon, RightArrow } from "@/components/Icons/Icons";
import Text from "@/components/Texts/Text"
import { NumericFormat } from 'react-number-format'
import { PageData } from "./_types/types";
import { convertAmount } from "@/utils/contractUtils";
import { useWallet } from "@/contexts/WalletProvider";
import RedeemSide from "./_components/RedeemSide";
import Tooltip from "@/components/Tooltip/Tooltip";
import NotificationDropdown from "./_components/NotificationDropdown";
import { isNil } from "lodash";
import { ClientEnum } from "@/types/types";
import SeiDashboard from "./_chain/SeiDashboard";
import ArchwayDashboard from "./_chain/ArchwayDashboard";
import NeutronDashboard from "./_chain/NeutronDashboard";
import InjectiveDashboard from "./_chain/InjectiveDashboard";

export default function Dashboard() {
    const { clientType } = useWallet();


    if (!isNil(clientType)) {
        if (clientType === ClientEnum.SEI) {
            return <SeiDashboard />
        }

        if (clientType === ClientEnum.ARCHWAY) {
            return <ArchwayDashboard />
        }

        if (clientType === ClientEnum.NEUTRON) {
            return <NeutronDashboard />
        }

        if (clientType === ClientEnum.INJECTIVE) {
            return <InjectiveDashboard />
        }
    }

    return (
        <InjectiveDashboard />
    )
}