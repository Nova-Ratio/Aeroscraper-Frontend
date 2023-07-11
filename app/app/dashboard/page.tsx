import GradientButton from "@/components/Buttons/GradientButton";
import StatisticCard from "@/components/Cards/StatisticCard";
import BorderedContainer from "@/components/Containers/BorderedContainer";
import ShapeContainer from "@/components/Containers/ShapeContainer";
import { RightArrow } from "@/components/Icons/Icons";
import Text from "@/components/Texts/Text";

export default function Dashboard() {
    return (
        <div>
            <BorderedContainer className="w-full px-8 py-6 flex justify-between items-center gap-2">
                <div className="flex items-center gap-11">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <img alt="ausd" className="w-10 h-10" src="/images/ausd.svg" />
                            <Text size="2xl">AUSD</Text>
                        </div>
                        <Text>$0.976923</Text>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <img alt="ausd" className="w-10 h-10" src="/images/atom.svg" />
                            <Text size="2xl">ATOM</Text>
                        </div>
                        <Text>$0.976923</Text>
                    </div>
                </div>
                <GradientButton className="w-[268px] h-[69px]">
                    <Text>Connect Wallet</Text>
                </GradientButton>
            </BorderedContainer>
            <BorderedContainer className="w-full p-3 mt-4">
                <div className="w-full rounded-lg bg-dark-purple px-4 py-2">
                    <Text size="2xl" weight="font-normal">Aeroscraper Statics</Text>
                    <div className="flex flex-wrap justify-center gap-6 mt-2 px-24">
                        <StatisticCard
                            title="Borrowing Fee"
                            description="X.XX%"
                            className="w-[191px] h-14"
                            tooltip="The Borrowing Fee is a one-off fee charged as a percentage of the borrowed amount (in AUSD) and is part of a Trove's debt. The fee varies between 0.5% and 5% depending on AUSD redemption volumes."
                        />
                        <StatisticCard
                            title="TVL"
                            description="XXXK ATOM ($XXXM)"
                            className="w-[191px] h-14"
                            tooltip="The Total Value Locked (TVL) is the total value of Atom locked as collateral in the system, given in AUSD and ATOM."
                        />
                        <StatisticCard
                            title="Troves"
                            description="X.XXX"
                            className="w-[191px] h-14"
                            tooltip="The total number of active Troves in the system."
                        />
                        <StatisticCard
                            title="AUSD supply"
                            description="XXXM"
                            className="w-[191px] h-14"
                            tooltip="The total AUSD minted by the Liquity Protocol."
                        />
                        <StatisticCard
                            title="Kickback Rate"
                            description="XXX%"
                            className="w-[191px] h-14"
                            tooltip="A rate between 0 and 100% set by the Frontend Operator that determines the fraction of ATOM that will be paid out as a kickback to the Stability Providers using the frontend."
                        />
                        <StatisticCard
                            title="AUSD in Stability Pool"
                            description="XXXM (XX.X%)"
                            className="w-[191px] h-14"
                            tooltip="The total AUSD currently held in the Stability Pool, expressed as an amount and a fraction of the AUSD supply."
                        />
                        <StatisticCard
                            title="Total Collateral Ratio"
                            description="XXX.X%"
                            className="w-[191px] h-14"
                            tooltip="The ratio of the Dollar value of the entire system collateral at the current ATOM:AUSD price, to the entire system debt."
                        />
                    </div>
                </div>
            </BorderedContainer>
            <div className="flex items-center">
                <ShapeContainer className="flex-[3]" width="" height="">
                    <div className='flex flex-col w-full h-full'>
                        <Text size="3xl" weight="font-normal">Trove</Text>
                        <Text weight="font-normal" className="mt-4">You haven’t borrowed any AUSD yet.</Text>
                        <Text size="base" className="mt-2">You can borrow AUSD by opening a Trove.</Text>
                        <GradientButton className="w-full max-w-[221px] h-11 mt-4 ml-auto md:mx-auto" rounded="rounded-lg">
                            <Text>Open Trove</Text>
                        </GradientButton>
                    </div>
                </ShapeContainer>
                <ShapeContainer className="flex-[3]" width="" height="">
                    <div className='flex flex-col w-full h-full'>
                        <Text size="3xl" weight="font-normal">Stability Pool</Text>
                        <Text weight="font-normal" className="mt-4">You have no AUSD in the Stability Pool.</Text>
                        <Text size="base" className="mt-2">You can earn ATOM and AUSD rewards by deposting AUSD.</Text>
                        <GradientButton className="w-full max-w-[221px] h-11 mt-4 ml-auto" rounded="rounded-lg">
                            <Text>Enter</Text>
                        </GradientButton>
                    </div>
                </ShapeContainer>
                <ShapeContainer className="flex-1 cursor-pointer active:scale-95 transition-all" width="" height="">
                    <div className="w-full h-full flex flex-wrap justify-center items-center">
                        <Text size="base" className="whitespace-nowrap">Risky Troves</Text>
                        <RightArrow width="24" height="24" />
                    </div>
                </ShapeContainer>
            </div>
        </div>
    )
}