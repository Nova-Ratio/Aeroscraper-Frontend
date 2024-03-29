export const checkPoint = async (address: string) => {
  try {
    const local = localStorage.getItem("referralCode");
    let res = await fetch("/api/checkerbyid/" + address+"?ref="+"yif8dd1eprvs25x");
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

