import * as express from "express";
import axios from "axios";
import * as https from "https";
import { dbConnection } from "@ace/cloud-db/lib/database/company.db";
import { Mikrotik } from "@ace/cloud-db/lib/entity/mikrotik";
import { ActiveRouter, Customers, ServiceAccounts } from "@ace/cloud-db/lib/entity";

export const MikroTikRoutes = express.Router();

export async function getMTConnection(routerId: number, conn: any) {
  const router = await conn.getRepository(Mikrotik).findOne({ where: { id: routerId } });

  
  if (!router) {
    throw new Error("Router not found in Database.");
  }

  if (!router.isActive) {
    throw new Error(`Router [${router.name}] is currently DISABLED. Please enable it first.`);
  }

  if (!router.status) {
    throw new Error(`Router [${router.name}] is OFFLINE. Cannot send commands.`);
  }

	try {
		const data = axios.create({
			baseURL: `https://${router.ipDomain}/rest`,
			auth: {
				username: router.username,
				password: router.password,
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			timeout: 10000, 
		});

		return data
		
	} catch (error) {
		console.log({ace: error})
	}

}

export async function mtss(router: Mikrotik, conn: any) {
  let isOnline = false;
  let statusMsg = "Offline";
  const repo = conn.manager.getRepository(Mikrotik);

  try {
    const mt = axios.create({
      baseURL: `https://${router.ipDomain}/rest`,
      auth: { username: router.username, password: router.password },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 4000,
    });

    await mt.get('/system/identity');      
    isOnline = true;
    statusMsg = "Online";

  } catch (error: any) {
    const isAuthError = error.response?.status === 401;
    
    if (isAuthError) {
      console.error(`🚨 [Router ${router.id}] WRONG PASSWORD. Deactivating...`);
      // I-OFF ang router sa DB para tumigil ang spamming
			await repo.update(router.id, { isActive: false, status: false });
      return { ...router, status: false, isActive: false };
    }
    
    isOnline = false;
  }

	console.log("dfdf", isOnline)
  // Update DB and Return the object directly to avoid another findOne query
  await repo.update(router.id, { status: isOnline });
  
  // I-return ang merged data para sa socket emit
  return { ...router, status: isOnline };
}


MikroTikRoutes.post("/save-router", async (req, res) => {
  try {
		const conn = await dbConnection();
		const data = req.body as Mikrotik;
		const repo = conn.getRepository(Mikrotik); 

		const mt = new Mikrotik();
		if (data.id) {
				mt.id = data.id;
		}
		// 3. I-assign ang mga values
		mt.name = data.name;
		mt.ipDomain = data.ipDomain;
		mt.username = data.username;
		mt.password = data.password;
		mt.code = data.code;
		mt.port = data.port;
		mt.isActive = data.isActive;

		await repo.save(mt); 
		return res.json({ success: true, message: data.id ? "Updated!" : "Saved!" });
  } catch (error: any) {}
});

MikroTikRoutes.get('/get-router', async (req, res) => {
  try {
    const conn = await dbConnection();
		const query = await conn.getRepository(Mikrotik).find({
			select: [
				"id",
				"name",
				"ipDomain",
				"username",
				"port",
				"status",
				"code",
				"isActive",
				"password",
			]
		});
			
    res.json(query);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

MikroTikRoutes.post('/delete-router', async (req, res) => {
  try {
    const { id } = req.body; // id ng router na ide-delete

    if (!id) {
      return res.status(400).json({ message: 'Missing router ID' });
    }

    const conn = await dbConnection();
    const repo = conn.getRepository(Mikrotik);

    // check kung exist
    const router = await repo.findOne({ where: { id } });
    if (!router) {
      return res.status(404).json({deleted: false, message: 'Router not found' });
    }

    await repo.remove(router); // or repo.delete(id) kung direct
    res.json({deleted: true, message: 'Router deleted successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


MikroTikRoutes.post('/get-server', async (req, res) => {
  try {
    const conn = await dbConnection();  
    const { routerid } = req.body

    if (!routerid) return res.status(400).json({ message: 'Missing routerid' })

    const mt = await getMTConnection(routerid, conn)
    const response = await mt.get('/ip/dhcp-server') // ✅ dito makukuha ang IP/MAC
    const data = response.data

		console.log(data)


    return res.json(data)
  } catch (error: any) {
    console.error('Get Server Error:', error.message || error)
    return res.status(500).json([])
  }
})

MikroTikRoutes.get('/get-dhcp-lease', async (req, res) => {
  try {
    const conn = await dbConnection();  
		const activeRouter = await conn.manager.getRepository(ActiveRouter).findOneBy({id: 1});

    if (!activeRouter) return res.status(400).json({ message: 'Missing routerid' })
    const mt = await getMTConnection(activeRouter.routerId, conn)
    const response = await mt.get('/ip/dhcp-server/lease')

    const data = response.data
    return res.json(data)
  } catch (error: any) {
    console.error('Get Server Error:', error.message || error)
    return res.status(500).json([])
  }
})

MikroTikRoutes.get('/get-dhcp-leases', async (req, res) => {
  try {
    const conn = await dbConnection();  
		const activeRouter = await conn.manager.getRepository(ActiveRouter).findOneBy({id: 1});

    if (!activeRouter) return res.status(400).json({ message: 'Missing routerid' })
		// 	const newLease = {
    //   "address": "192.168.100.61",      // Ang IP na gusto mong ibigay
    //   "mac-address": "FC:FB:FB:01:22:43", // Ang MAC address ng modem/device
    //   "comment": "Added via Web App",    // Optional pero maganda para sa tracking
    //   "server": "all"                    // O kaya yung specific name ng DHCP server mo (e.g., "dhcp1")
    // };

		const updatePayload = {
      "address": "192.168.100.24",      // Bagong IP (halimbawa lang)
      "mac-address": "FC:FB:FB:01:22:24",
      "comment": "bago",
      "disabled": "false",
      "address-lists": "ace"
    };

    const mt = await getMTConnection(activeRouter.routerId, conn)
    // const response = await mt.put('/ip/dhcp-server/lease', newLease)
    // const response = await mt.get('/ip/dhcp-server/lease')
		const response = await mt.put('/ip/dhcp-server/lease', updatePayload);
		console.log(response)
    const data = response.data

    return res.json(data)
  } catch (error: any) {
    console.error('Get Server Error:', error.message || error)
    return res.status(500).json([])
  }
})

MikroTikRoutes.post('/save-active-router', async (req, res) => {
  try {
    const conn = await dbConnection();
    const { routerid } = req.body;

    if (!routerid) {
      return res.status(400).json({ message: 'Router ID is required' });
    }

		const selectedRouter = JSON.parse(routerid);
		console.log(selectedRouter)

    const activeRouterRepo = conn.getRepository(ActiveRouter);

    const result = await activeRouterRepo.save({
      id: 1, 
      routerId: Number(selectedRouter.id),
			routerCode: selectedRouter.code
    });

    return res.status(200).json({
      message: 'Active router updated successfully',
      data: result
    });

  } catch (error: any) {
    console.error('Save Active Router Error:', error.message || error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

MikroTikRoutes.get('/get-active-router', async (req, res) => {
  const conn = await dbConnection();
  const repo = conn.getRepository(ActiveRouter);
  const active = await repo.findOne({ where: { id: 1 } });
  return res.json(active); // Ibabalik nito yung { id: 1, routerId: ... }
});

// MikroTikRoutes.post('/unbind-mac-ip', async (req, res) => {
// 	try {
// 		const { mac, customerId } = req.body
// 		const conn = await dbConnection();
// 		const activeRouter = await conn.manager.getRepository(ActiveRouter).findOneBy({id: 1});
		

// 		if (!activeRouter) return res.status(400).json({ message: 'Missing routerid' })
//     const mt = await getMTConnection(activeRouter.routerId, conn)
// 		const response = await mt.get('/ip/dhcp-server/lease')
// 		const targetLease = await response.data.find( l => l['mac-address'] === mac)

// 		if (!targetLease) {
//       return res.status(404).json({ message: "Lease not found" });
//     }

// 		const hehe = await mt.post('/ip/dhcp-server/lease/remove', {
//       '.id': targetLease['.id']
//     });
	
// 		if (hehe.status == 200) {
// 			await conn.manager.getRepository(Customers).update(Number(customerId), {
// 				ipAddress: null,
// 				macAddress: null,
// 			});
// 		}

//     return res.json({ message: `MAC ${mac} deleted successfully` });
// 	} catch (error) {
// 		console.error(error);
//     return res.status(500).json({ error: error.message });
// 	}
 
// });

// MikroTikRoutes.post('/unbind-mac-ip', async (req, res) => {
//   const queryRunner = (await dbConnection()).createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();

//   try {
//     const { mac, customerId } = req.body;
//     if (!mac || !customerId) throw new Error("Missing MAC or Customer ID");

//     // 1. Kunin ang Router Info (sa loob ng transaction)
//     const activeRouter = await queryRunner.manager.findOneBy(ActiveRouter, { id: 1 });
//     if (!activeRouter) throw new Error("Active router config not found");

//     // 2. MikroTik Logic (Gawin muna ito bago ang DB Commit)
//     const conn = await dbConnection();
//     const mt = await getMTConnection(activeRouter.routerId, conn);
    
//     const response = await mt.get('/ip/dhcp-server/lease');
//     const leases = Array.isArray(response) ? response : (response.data || []);
//     const targetLease = leases.find(l => l['mac-address'] === mac);

//     if (!targetLease) {
//       // Kung wala sa MikroTik, i-rollback ang transaction at itigil
//       await queryRunner.rollbackTransaction();
//       return res.status(404).json({ message: "Lease not found in MikroTik" });
//     }

//     // 3. Delete sa MikroTik
//     await mt.post('/ip/dhcp-server/lease/remove', { '.id': targetLease['.id'] });

//     // 4. Database Update (Gamit ang QueryRunner)
//     await queryRunner.manager.update(Customers, Number(customerId), {
//       ipAddress: null,
//       macAddress: null,
//     });

//     // 5. COMMIT: Dito na permanenteng isasave sa Database
//     await queryRunner.commitTransaction();

//     return res.json({ message: `MAC ${mac} successfully unbinded and database updated.` });

//   } catch (error) {
//     // Kapag may kahit anong error, babalik sa dati ang DB records
//     await queryRunner.rollbackTransaction();
//     console.error("Unbind Error:", error);
//     return res.status(500).json({ error: error.message || "Transaction failed" });
//   } finally {
//     // IMPORTANTE: Laging i-release ang queryRunner para hindi ma-ubusan ng DB connections
//     await queryRunner.release();
//   }
// });

	MikroTikRoutes.post('/unbind-mac-ip', async (req, res) => {
		try {
			const { serviceNumber } = req.body;
			const conn = await dbConnection();
			const serviceRepo = conn.getRepository(ServiceAccounts);

			const account = await serviceRepo.findOneBy({ serviceNumber });
			if (!account) return res.status(404).json({ error: "Service record not found" });

			// I-save muna natin ang MAC address sa variable bago tayo gumalaw
			const macToRelease = account.macAddress;

			// --- STEP 1: MIKROTIK REMOVAL FIRST ---
			if (macToRelease) {
				try {
					const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
					if (activeRouter) {
						const mt = await getMTConnection(activeRouter.routerId, conn);
						
						// Mas maganda kung filter na agad sa API para mabilis
						const response = await mt.get('/ip/dhcp-server/lease');
						const leases = Array.isArray(response) ? response : (response.data || []);
						
						const targetLease = leases.find(l => l['mac-address'] === macToRelease);
						
						if (targetLease) {
							// Burahin sa MikroTik
							await mt.delete(`/ip/dhcp-server/lease/${targetLease['.id']}`);
						}
					}
				} catch (mtError) {
					// DITO ANG CRITICAL CHANGE:
					// Kung hindi ma-contact ang MikroTik, HUWAG burahin sa DB.
					console.error("MikroTik unbind failed:", mtError.message);
					return res.status(503).json({ 
						error: "Cannot reach MikroTik. Unbind aborted to prevent ghost leases." 
					});
				}
			}

			// --- STEP 2: DATABASE REMOVAL (Only if Step 1 is done) ---
			await serviceRepo.remove(account);

			return res.json({ message: "Successfully unbinded from MikroTik and Database." });

		} catch (error) {
			console.error("Unbind Error:", error);
			return res.status(500).json({ error: "Failed to process unbind" });
		}
	});

// MikroTikRoutes.post('/unbind-mac-ip', async (req, res) => {
//   try {
//     const { serviceNumber, customerId } = req.body;
//     const conn = await dbConnection();

//     // 1. UPDATE AGAD SA DATABASE (Para kahit mag-fail ang MikroTik, malinis na ang DB)
//     const serviceRepo = conn.getRepository(ServiceAccounts);
// 		const accountToRemove = await serviceRepo.findOneBy({ serviceNumber: serviceNumber });

//     // 2. SUBUKANG BURAHIN SA MIKROTIK (Optional/Best Effort)

// 		if (accountToRemove) {
//     // 2. Burahin ang object
//     await serviceRepo.remove(accountToRemove);
// }
//     try {
//       const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
//       if (activeRouter) {
//         const mt = await getMTConnection(activeRouter.routerId, conn);
//         const response = await mt.get('/ip/dhcp-server/lease');
//         const leases = Array.isArray(response) ? response : (response.data || []);
        
//         // Hanapin ang MAC, pag nahanap, remove agad
//         const targetLease = leases.find(l => l['mac-address'] === accountToRemove.macAddress);
//         if (targetLease) {
//           await mt.post('/ip/dhcp-server/lease/remove', { '.id': targetLease['.id'] });
//         }
//       }
//     } catch (mtError) {
//       // Pinabayaan lang natin 'to, ang importante na-update na 'yung database
//       console.log("MikroTik unbind failed, but DB was updated:", mtError.message);
//     }

//     return res.json({ message: "Unbind request processed." });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to process unbind" });
//   }
// });

// MikroTikRoutes.post('/toggle-service', async (req, res) => {
//   try {
//     const { serviceNumber } = req.body;
//     const conn = await dbConnection();
//     const serviceRepo = conn.getRepository(ServiceAccounts);

//     const account = await serviceRepo.findOneBy({ serviceNumber });
//     if (!account) return res.status(404).json({ error: "Service not found" });

//     const newStatus = !account.isActive;
//     account.isActive = newStatus;
//     account.addressList = newStatus ? 'IPOE-ACCEPT' : 'IPOE-DROP';
//     await serviceRepo.save(account); 

//     try {
//       const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
//       if (activeRouter && account.macAddress) {
//         const mt = await getMTConnection(activeRouter.routerId, conn);
        
//         const response = await mt.get('/ip/dhcp-server/lease');
//         const leases = Array.isArray(response) ? response : (response.data || []);
        
//         const targetLease = leases.find(l => l['mac-address'] === account.macAddress);

//         if (targetLease) {
//           await mt.patch(`/ip/dhcp-server/lease/${targetLease['.id']}`, {
//              "address-lists": newStatus ? "IPOE-ACCEPT" : "IPOE-DROP",
//           });
//         }
//       }
//     } catch (mtError) {
//       console.log("MikroTik sync failed:", mtError.message);
//     }

//     return res.json({ 
//       message: `Service ${newStatus ? 'Enabled' : 'Disabled'}`, 
//       isActive: newStatus 
//     });

//   } catch (error) {
//     return res.status(500).json({ error: "Toggle failed" });
//   }
// });

MikroTikRoutes.post('/toggle-service', async (req, res) => {
  try {
    const { serviceNumber } = req.body;
    const conn = await dbConnection();
    const serviceRepo = conn.getRepository(ServiceAccounts);

    const account = await serviceRepo.findOneBy({ serviceNumber });
    if (!account) return res.status(404).json({ error: "Service not found" });

    const newStatus = !account.isActive;
    const targetAddressList = newStatus ? 'IPOE-ACCEPT' : 'IPOE-DROP';

    // --- STEP 1: MIKROTIK SYNC FIRST ---
    try {
      const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
      
      if (!activeRouter) throw new Error("No active router configured");
      if (!account.macAddress) throw new Error("Subscriber has no MAC address");

      const mt = await getMTConnection(activeRouter.routerId, conn);
      
      // Kunin ang lease list
      const response = await mt.get('/ip/dhcp-server/lease');
      const leases = Array.isArray(response) ? response : (response.data || []);
      const targetLease = leases.find(l => l['mac-address'] === account.macAddress);

      if (!targetLease) {
        throw new Error("Lease not found in MikroTik");
      }

      // I-update ang MikroTik
      await mt.patch(`/ip/dhcp-server/lease/${targetLease['.id']}`, {
          "address-lists": targetAddressList,
      });

    } catch (mtError) {
      // Kung nag-fail dito, hihinto na ang execution. 
      // Hindi gagalaw ang Database status sa ibaba.
      console.log("MikroTik sync failed:", mtError.message);
      return res.status(503).json({ 
        error: "Hardware sync failed. Database not updated.", 
        details: mtError.message 
      });
    }

    // --- STEP 2: DATABASE UPDATE (Only if Step 1 succeeds) ---
    account.isActive = newStatus;
    account.addressList = targetAddressList;
    await serviceRepo.save(account);

    return res.json({ 
      message: `Service ${newStatus ? 'Enabled' : 'Disabled'} and synced to MikroTik`, 
      isActive: newStatus 
    });

  } catch (error) {
    console.error("Critical Error:", error);
    return res.status(500).json({ error: "Toggle failed" });
  }
});



