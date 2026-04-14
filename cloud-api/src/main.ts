// import "reflect-metadata";
// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import { Routes, Login } from "./routes/routes";
// import { createServer } from "http"; // 1. Siguraduhin na nandito ito
// import { Server } from "socket.io";   // 2. Siguraduhin na nandito ito
// import { mtss } from "./routes/mikrotik";
// import { dbConnection } from "@ace/cloud-db/lib/database/company.db";
// import { Mikrotik } from "@ace/cloud-db/lib/entity/mikrotik";

// async function application() {
//   const app = express();
// 	const conn = await dbConnection()



//   // Middleware
//   app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Mas safe kung explicit ang origin
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: false }));
//   app.use(cookieParser());

//   // --- DITO MO I-ADD/AYUSIN ANG SOCKET SETUP ---
//   const httpServer = createServer(app); // I-wrap ang express app sa http server
  
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:3000", // URL ng Next.js mo
//       methods: ["GET", "POST"],
//       credentials: true
//     }
//   });
//   // ----------------------------------------------

//   // Iyong setInterval logic
//   setInterval(async () => {
//     try {
// 			const routers = await conn.manager.getRepository(Mikrotik).find();
//       // const mt = await mts();
// 			// routers.forEach(e => {
// 			// 	mtss(e)
// 			// });

// 			for (const router of routers) {
// 				await mtss(router, conn)
// 			}
//       // await mtss(routers);
//       // const res = await mt.get('/system/identity');
//       // console.log("Router Name:", res.data);
      
//       // io.emit("interface-stats", true);
//     } catch (error: any) {
//       // io.emit("interface-stats", false);
//     }
//   }, 9000);

//   // Routes
//   app.use('/api', Routes);
//   app.use('/api', Login);

//   // --- CRITICAL CHANGE DITO ---
//   // MALI: app.listen(4000)
//   // TAMA: httpServer.listen(4000)
//   httpServer.listen(4000, () => {
//     console.log("🚀 Server & Socket.io ready at http://localhost:4000");
//   });
// }

// application();

import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Routes, Login } from "./routes/routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { mtss } from "./routes/mikrotik";
import { dbConnection } from "@ace/cloud-db/lib/database/company.db";
import { Mikrotik } from "@ace/cloud-db/lib/entity/mikrotik";

async function application() {
  const app = express();
  const conn = await dbConnection();

  app.use(cors({
		origin: "http://localhost:3000", // o kung ano man ang frontend URL mo
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization", "Pragma", "Cache-Control"]
	}));
	
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

	setInterval(async () => {
  try {
    const repo = conn.manager.getRepository(Mikrotik);
    const routers = await repo.find({ where: { isActive: true } });

    // SABAY-SABAY silang mag-che-check (Parallel)
    await Promise.all(routers.map(async (router) => {
      const updatedRouter = await mtss(router, conn);
      if (updatedRouter) {
        io.emit("router-status-updated", updatedRouter);
      }
    }));
    
  } catch (error) {
    console.error("Interval Error:", error);
  }
}, 20000); // Gawin nating 10s para hindi masyadong bugbog

  // --- INTERVAL LOGIC ---
  // setInterval(async () => {
  //   try {
  //     const routers = await conn.manager.getRepository(Mikrotik).find();

  //     for (const router of routers) {
  //       // 1. I-run ang connection check at DB update
  //       await mtss(router, conn);

  //       // 2. Kunin ang updated record para sa status
  //       const updated = await conn.manager.getRepository(Mikrotik).findOneBy({ id: router.id });
        
  //       // 3. I-emit ang specific router update sa UI
  //       if (updated) {
  //         io.emit("router-status-updated", updated);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Interval Error:", error);
  //   }
  // }, 9000);

  app.use('/api', Routes);
  app.use('/api', Login);

  httpServer.listen(4000, () => {
    console.log("🚀 Server & Socket.io ready at http://localhost:4000");
  });
}

application();