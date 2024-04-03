export const checkPoint = async (address: string) => {
  try {
    const local = localStorage.getItem("referralCode");

    let res = await fetch(
      process.env.NEXT_PUBLIC_WEBSITE_REF_API +
        "/checkbyaddress?address=" +
        address +
        "&ref=" +
        local
    );

    if (res.ok) {
      return res.json();
    }
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const firstTrove = async (address: string) => {
  try {
    const local = localStorage.getItem("referralCode");

    let res = await fetch(
      process.env.NEXT_PUBLIC_WEBSITE_REF_API +
        "/first-trove?address=" +
        address +
        "&ref=" +
        local
    );

    if (res.ok) {
      return res.json();
    }
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
};
