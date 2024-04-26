import Link from "next/link";
import Text from "../Texts/Text";

export default function Partners() {
  return (
    <div>
      <h2 className="text-4xl font-semibold text-white mb-4 mt-14">
        Our Partners
      </h2>
      {/* <Text size="base" className="mt-8" textColor="text-white/60">
        Chains
      </Text>
      <div className="flex gap-4">
        <Link
          className="flex gap-6"
          href={"https://injective.com/"}
          target="_blank"
        >
          <img
            alt={"injective"}
            src={"/images/token-images/injective.svg"}
            className="px-4 w-[148px] h-[70px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
        <Link
          className="flex gap-6"
          href={"https://www.sei.io/"}
          target="_blank"
        >
          <img
            alt={"sei"}
            src={"/images/token-images/sei.svg"}
            className="px-4 w-[148px] h-[70px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
        <Link
          className="flex gap-6"
          href={"https://xion.bonusblock.io/"}
          target="_blank"
        >
          <img
            alt={"xion"}
            src={"/images/token-images/xion.svg"}
            className="px-4 w-[120px] h-[70px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
        <Link
          className="flex gap-6"
          href={"https://archway.io/"}
          target="_blank"
        >
          <img
            alt={"archway"}
            src={"/images/token-images/archway-logo.svg"}
            className="px-4 w-[144px] h-[70px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
      </div>
      <Text size="base" className="mt-8" textColor="text-white/60">
        Security
      </Text>
      <div className="flex gap-4">
        <Link className="flex gap-6" href={"https://beosin.com/"}>
          <img
            alt={"beosin security"}
            src={"/images/beosin.svg"}
            className="px-4 w-[148px] h-[60px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
        <Link className="flex gap-6" href={"https://www.ironnode.io/"}>
          <img
            alt={"iron node security"}
            src={"/images/iron-node.svg"}
            className="px-4 w-[148px] h-[60px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
      </div>
      <Text size="base" className="mt-8" textColor="text-white/60">
        Oracle
      </Text>
      <Link className="flex gap-6" href={"https://pyth.network/"}>
        <img
          alt={"pyth"}
          src={"/images/pyth2.svg"}
          className="px-8 w-[148px] h-[60px] mt-4 border border-white/10 rounded-md"
        />
      </Link>
      <Text size="base" className="mt-8" textColor="text-white/60">
        Defi / Dex
      </Text>
      <div className="flex gap-4">
        <Link
          className="flex gap-6 border border-white/10 mt-4 rounded-md py-4 px-3 w-fit items-center"
          href={"https://dojo.trading/"}
        >
          <img
            alt={"dojoswap"}
            src={"/images/dojoswap.png"}
            className="w-[148px] h-fit  "
          />
        </Link>
        <Link
          className="flex gap-6 border border-white/10 mt-4 rounded-md py-4 px-3 w-fit items-center"
          href={"https://astrovault.io/"}
        >
          <img
            alt={"astro-vault"}
            src={"/images/astro-vault.png"}
            className="w-[115px] h-fit  "
          />
        </Link>
      </div> */}
      {data.map((item, index) => (
        <div key={index} className="mt-8">
          <Text size="base" className="mt-8" textColor="text-white/60">
            {item.title}
          </Text>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {item.children.map((child, index) => (
              <Link
                key={index}
                href={child.link}
                target="_blank"
                className="flex mt-4 justify-center items-center w-full h-[50px] md:h-[70px] "
              >
                <img
                  alt={child.title}
                  src={child.image}
                  className=" h-full w-fit rounded-md"
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const data = [
  {
    title: "Chains",
    children: [
      {
        title: "Injective",
        link: "https://injective.com/",
        image: "/landing/chains/inj.png",
      },
      {
        title: "SEI",
        link: "https://www.sei.io/",
        image: "/landing/chains/sei.png",
      },
      {
        title: "Xion",
        link: "https://xion.bonusblock.io/",
        image: "/landing/chains/xion.png",
      },
      {
        title: "Archway",
        link: "https://archway.io/",
        image: "/landing/chains/archway.png",
      },
    ],
  },
  {
    title: "Security",
    children: [
      {
        title: "Beosin",
        link: "https://beosin.com/",
        image: "/landing/security/beosin.png",
      },
      {
        title: "Iron Node",
        link: "https://www.ironnode.io/",
        image: "/landing/security/iron.png",
      },
    ],
  },
  {
    title: "Oracle",
    children: [
      {
        title: "Pyth",
        link: "https://pyth.network/",
        image: "/landing/oracle/pyth.png",
      },
    ],
  },
  {
    title: "Defi / Dex",
    children: [
      {
        title: "DojoSwap",
        link: "https://dojo.trading/",
        image: "/landing/defi/dojo.png",
      },
      {
        title: "AstroVault",
        link: "https://astrovault.io/",
        image: "/landing/defi/astro.png",
      },
    ],
  },
];
