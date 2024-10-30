"use client";

import GradientButton from "@/components/Buttons/GradientButton";
import OutlinedButton from "@/components/Buttons/OutlinedButton";
import CookieAccept from "@/components/CookieAccept/CookieAccept";
import Faq from "@/components/FAQ/Faq";
import { BackgroundWave, LogoSecondary } from "@/components/Icons/Icons";
import Loading from "@/components/Loading/Loading";
import Text from "@/components/Texts/Text";
import Audit from "@/components/landing/audit";
import Footer from "@/components/landing/footer";
import Hackathons from "@/components/landing/hackathons";
import Partners from "@/components/landing/partners";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    router.prefetch("/app/dashboard");
  }, [router]);

  useEffect(() => {
    const ref = search.get("ref");
    console.log(ref);
    if (ref) {
      localStorage.setItem("referralCode", ref);
    }
  }, [search]);
  return (
    <Suspense fallback={<Loading />}>
      <div>
        <main className="container w-full px-2 md:px-[64px] mx-auto ">
          <div className="flex md:flex-row flex-col md:justify-between w-full gap-6">
            <div className="max-w-[626px] pt-6 md:pt-0">
              <div className="flex items-center gap-6 lg:mt-20">
                <LogoSecondary />
                <Text size="2xl" textColor="text-white">
                  Aeroscraper
                </Text>
              </div>
              <h1 className="text-white text-[36px] md:text-[64px] leading-[46px] md:leading-[72px] font-semibold mt-32 md:mt-10">
                Your decentralized lending-borrowing protocol
              </h1>
              <h2 className="text-base text-ghost-white font-medium mt-10">
                Empowering you with autonomy and direct transactions.
                <br />
                <br />
                Interest-free, over-collateralized stablecoin and DeFi loans.
                <br />
                <br />
                Fully automated and governance-free.
                <br />
                <br />
                The protocol only charges a one-time fee. Deposit collateral and
                access loans in stablecoins pegged to the US dollar.
                <br />
                <br />
              </h2>
              <LaunchButtons />
            </div>
            <div className="w-full md:w-1/2 max-w-[510px] gradientBorderGray flex flex-col gap-6 p-4 md:p-6 py-10 md:py-16 items-center bg-white mt-32 -mr-12 h-fit text-white text-center">
              <div className="flex items-center gap-6">
                <h3 className="tertiary-gradient-text auditCard-text md:text-[40px] text-4xl">
                  Aeroscraper is Live on Scroll Sepolia Testnet
                </h3>
              </div>
              <p>
                We are proud to announce that the Aeroscraper protocol <br /> is live
                on the Scroll Sepolia Testnet. <br /> Enjoy decentralized lending and
                stablecoin borrowing by <br /> creating your first trove now.
              </p>
            </div>
          </div>
          <Audit />
          <Hackathons />
          <div className="max-w-[626px]">
            <Faq />
          </div>
          <LaunchButtons />
          <Partners />
          <BackgroundWave
            animate
            className="absolute top-40 md:-top-3 right-0 -z-10 md:w-[1200px] w-[300px]"
          />
        </main>
        <Footer />
      </div>
      <CookieAccept />
    </Suspense>
  );
}

function LaunchButtons() {
  return (
    <div className="w-full flex gap-4 md:gap-8 mt-10">
      <Link href={"/app/dashboard"}>
        <GradientButton className="w-[170px] lg:w-[227px] h-[37px] rounded-lg self-end px-8 group">
          <Text size="base">Launch App</Text>
        </GradientButton>
      </Link>
      <Link
        href={"https://aeroscraper.gitbook.io/aeroscraper/"}
        target="_blank"
      >
        <OutlinedButton
          containerClassName="w-[170px] lg:w-[227px]"
          className="h-[41px] rounded-lg self-end group"
        >
          <Text size="base">Learn More</Text>
        </OutlinedButton>
      </Link>
    </div>
  );
}