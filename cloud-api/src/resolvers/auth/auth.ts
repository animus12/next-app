import "dotenv/config";
import { sign } from "jsonwebtoken";

export const createAccessToken = (
  username: string,
  userid: number,
) => {
  return sign(
    {
      username: username,
      userid: userid,
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: "1d" } // 1 DAY
  );
};

export const createAccessCookie = (
  res: any,
  token: any,
) => {
   res.cookie(process.env.ACCESS_COOKIE_NAME, token, {
    httpOnly: true,
    //      HR   MIN  SEC  MLSEC
		  maxAge: 24 * 60 * 60 * 1000, 
    // maxAge:  60 * 1000, // 1 DAY,
    // sameSite: "none",
    // secure: true,
  });

};