import Cookies from "js-cookie";

export const getCookieToken = () => {
  return Cookies.get("token"); // 'token' is the name/key of your cookie
};
