export const checkPoint = async (address: string) => {
  try {
    const local = localStorage.getItem("referralCode");
    console.log("referralCode", local);

    let res = await fetch(
      process.env.NEXT_PUBLIC_WEBSITE_REF_API +
        "/checkbyaddress?address=" +
        address +
        "&ref=" +
        local
    );
    console.log(res);
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
    console.log("referralCode", local);
    let res = await fetch(
      process.env.NEXT_PUBLIC_WEBSITE_REF_API +
        "/first-trove?address=" +
        address +
        "&ref=" +
        local
    );
    console.log(res);
    if (res.ok) {
      return res.json();
    }
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
};
