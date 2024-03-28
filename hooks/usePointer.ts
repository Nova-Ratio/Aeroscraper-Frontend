export const checkPoint = async (address: string) => {
  try {
    let res = await fetch("/api/checkerbyid/" + address);
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
};

