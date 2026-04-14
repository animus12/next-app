// import { MiddlewareFn } from "type-graphql";
// import { verify } from "jsonwebtoken";
// import { AuthenticationError } from "apollo-server-express";
// import "dotenv/config";
// import { error } from "node:console";

// export const IsAuth = async (req, res, next) => {
//   const reqs = req;

// 	res.header("Access-Control-Allow-Origin", req.headers.origin);
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept, Pragma, Cache-Control, Expires");
// 	res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
// 	res.header("Access-Control-Allow-Credentials", "true");

//   if (!req?.cookies) {
//     throw new Error("No cookies found");
//   }

//   const token = req.cookies[process.env.ACCESS_COOKIE_NAME];

//   if (!token) {
//     throw new Error("Not authenticated");
//   }

//   try {
//     const payload = verify(
//       token,
//       process.env.ACCESS_TOKEN_KEY!
//     ) as any;

//     reqs.userId = payload.userid; // ✅
//   } catch {
//     throw new Error("Invalid or expired token");
//   }

//   return next();
// };


import { verify } from "jsonwebtoken";

export const IsAuth = (req, res, next) => {
	try {
		const token = req.cookies?.[process.env.ACCESS_COOKIE_NAME];

		if (!token) {
			return res.status(401).json({ message: "Not authenticated" });
		}

		const payload = verify(token, process.env.ACCESS_TOKEN_KEY!) as any;

		req.userId = payload.userid; // ✅ attach to request

		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};