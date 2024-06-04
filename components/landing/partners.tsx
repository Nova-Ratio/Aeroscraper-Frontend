import Link from "next/link";
import Text from "../Texts/Text";

export default function Partners() {
  return (
    <div>
      <h2 className="text-4xl font-semibold text-white mb-4 mt-14">
        Our Partners
      </h2>
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
      {
        title: "Nibiru",
        link: "https://nibiru.fi/",
        image: "/landing/chains/nibiru.png",
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
