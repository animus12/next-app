import { dbConnection } from "@ace/cloud-db/lib/database/company.db";
import { ActiveRouter, BandwidthProfile, Customers, Plan, ServiceAccounts } from "@ace/cloud-db/lib/entity";
import { Mikrotik } from "@ace/cloud-db/lib/entity/mikrotik";
import * as express from "express";
import { Not } from "typeorm";
import { getMTConnection } from "./mikrotik";
import { generateAutoNumber } from "../services/function";
export const  CustomerRoutes = express.Router();

CustomerRoutes.get("/get-customers", async (req, res) => {
	try {

		const conn = await dbConnection();
		const ar = conn.getRepository(ActiveRouter);

    // Dahil sigurado kang laging may record (id: 1)
    const findActiveRouter = await ar.findOneBy({ id: 1 });
		const customers = await conn.manager.createQueryBuilder()
		.select([
			'cs.*'
		])
		.from(Customers, 'cs')
		.leftJoin(ActiveRouter, 'ar', 'cs.routerCode = ar.routerCode')
		.where('cs.routerCode = :code', { code: findActiveRouter.routerCode})
		.getRawMany()
    

		return res.json(customers);
	} catch (error) {
		return res.status(500).json({ 
			message: "Internal Server Error", 
			error: error.message 
		});
	}
})

// CustomerRoutes.post("/get-customer", async (req, res) => {
// 	try {
// 		const { id }:{id:number} = req.body
// 		const conn = await dbConnection();
// 		const query = await conn.manager.createQueryBuilder()
// 		.select([
// 			'cs.id AS id',
// 			'cs.firstName AS firstName',
// 			'cs.lastName AS lastName',
// 			'cs.middleName AS middleName',
// 			'cs.mobileNo AS mobileNo',
// 			'cs.address AS address',
// 			'cs.email AS email',
// 			'cs.pin AS pin',
// 			'cs.ipAddress AS ipAddress',
// 			'cs.macAddress AS macAddress',
// 			'pl.name AS planName',
// 			'pl.description AS planDescription',
// 			'pl.price AS planPrice',
// 			'pr.name AS profilename',
// 		])
// 		.from(Customers, 'cs')
// 		.leftJoin(Plan,'pl', 'cs.planId = pl.id')
// 		.leftJoin(BandwidthProfile,'pr','pl.profileid = pr.id')
// 		.where('cs.id = :id', {id: id })
// 		.getRawOne()

// 		return res.json(query);
// 	} catch (error) {
// 		return res.status(500).json({ 
// 			message: "Internal Server Error", 
// 			error: error.message 
// 		});
// 	}
// })
// CustomerRoutes.post("/get-customer", async (req, res) => {
//   try {
//     const { id }: { id: number } = req.body;
//     const conn = await dbConnection();

//     // 1. Kunin ang Basic Customer Info
//     const customer = await conn.manager.createQueryBuilder()
//       .select([
//         'cs.id AS id',
//         'cs.firstName AS firstName',
//         'cs.lastName AS lastName',
//         'cs.middleName AS middleName',
//         'cs.mobileNo AS mobileNo',
//         'cs.address AS address',
//         'cs.email AS email',
//         'cs.pin AS pin'
//       ])
//       .from(Customers, 'cs')
//       .where('cs.id = :id', { id })
//       .getRawOne();

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // 2. Kunin lahat ng Services na naka-link sa Customer na ito
//     const services = await conn.manager.createQueryBuilder()
//       .select([
//         'sa.serviceNumber AS serviceNumber',
//         'sa.ipAddress AS ipAddress',
//         'sa.macAddress AS macAddress',
//         'sa.isActive AS isActive',
//         'sa.addressList AS addressList',
//         'pl.name AS planName',
//         'pl.price AS planPrice',
//         'pl.description AS planDescription',
//         'pr.name AS profileName'
//       ])
//       .from(ServiceAccounts, 'sa') // Gamitin ang bagong table mo
//       .leftJoin(Plan, 'pl', 'sa.planId = pl.id')
//       .leftJoin(BandwidthProfile, 'pr', 'pl.profileId = pr.id')
//       .where('sa.customerId = :id', { id })
//       .getRawMany();

//     return res.json({
//       ...customer,
//       services: services 
//     });

//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

CustomerRoutes.post("/get-customer", async (req, res) => {
  try {
    const { id } = req.body;
    const conn = await dbConnection();

    // 1. Ibalik ang kumpletong Customer Info (lahat ng fields na kailangan mo)
    const customer = await conn.manager.createQueryBuilder()
      .select([
        'cs.id AS id',
        'cs.firstName AS firstName',
        'cs.lastName AS lastName',
        'cs.middleName AS middleName',
        'cs.mobileNo AS mobileNo',
        'cs.address AS address',
        'cs.email AS email',
        'cs.pin AS pin'
      ])
      .from(Customers, 'cs')
      .where('cs.id = :id', { id })
      .getRawOne();

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // 2. Ibalik ang kumpletong Services (kasama ang Plan at Profile joins)
    const dbServices = await conn.manager.createQueryBuilder()
      .select([
        'sa.serviceNumber AS serviceNumber',
        'sa.ipAddress AS ipAddress',
        'sa.macAddress AS macAddress',
        'sa.isActive AS dbStatus',       // I-keep natin yung sa DB as fallback
        'sa.addressList AS dbAddressList',
        'pl.name AS planName',
        'pl.price AS planPrice',
        'pl.description AS planDescription',
        'pr.name AS profileName'
      ])
      .from(ServiceAccounts, 'sa')
      .leftJoin(Plan, 'pl', 'sa.planId = pl.id')
      .leftJoin(BandwidthProfile, 'pr', 'pl.profileId = pr.id')
      .where('sa.customerId = :id', { id })
      .getRawMany();

    // 3. MIKROTIK SYNC

    let finalServices = dbServices;

    try {
      const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
      if (activeRouter) {
        const mt = await getMTConnection(activeRouter.routerId, conn);
        const response = await mt.get('/ip/dhcp-server/lease');
        const leases = Array.isArray(response) ? response : (response.data || []);

        finalServices = dbServices.map(service => {
          const liveLease = leases.find(l => l['mac-address'] === service.macAddress);          
          if (liveLease) {
            // Kunin natin ang status field mula sa MikroTik response
            const mtStatus = liveLease['status']; // Ito yung 'bound', 'waiting', etc.

            return {
              ...service,
              isActive: liveLease['address-lists'] === 'IPOE-ACCEPT',
              addressList: liveLease['address-lists'] || 'NONE',
              leaseStatus: mtStatus, // 'bound', 'waiting', 'offered', 'testing'
              isLive: true,
              mikrotikMsg: mtStatus === 'bound' 
                ? "Device is online and connected." 
                : `Device found but status is ${mtStatus}.`
            };
          }
          
          // KUNG WALANG LEASE NA HANAP:
          return { 
            ...service, 
            isActive: false, 
            isLive: false,
            leaseStatus: 'offline',
            addressList: 'NOT_FOUND',
            mikrotikMsg: `MAC address ${service.macAddress} not available in DHCP leases`
          };
        });
      }
    } catch (mtError) {
      console.log("MikroTik Offline:", mtError.message);
      finalServices = dbServices.map(s => ({ 
        ...s, 
        isActive: s.dbStatus, 
        addressList: s.dbAddressList,
        isLive: false,
        leaseStatus: 'unknown',
        mikrotikMsg: "Router unreachable - showing last known DB status"
      }));
    }

    return res.json({
      ...customer,
      services: finalServices
    });

  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
});

// CustomerRoutes.post("/get-customer", async (req, res) => {
//   try {
//     const { id } = req.body;
//     const conn = await dbConnection();

//     // 1. Kunin ang Customer Info
//     const customer = await conn.manager.createQueryBuilder()
//       .select(['cs.id', 'cs.firstName', 'cs.lastName', 'cs.address']) // simplified for example
//       .from(Customers, 'cs')
//       .where('cs.id = :id', { id })
//       .getRawOne();

//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     // 2. Kunin ang Services mula sa Database
//     const services = await conn.manager.createQueryBuilder()
//       .select([
//         'sa.serviceNumber AS serviceNumber',
//         'sa.macAddress AS macAddress',
//         'sa.isActive AS dbStatus', // Rename natin para hindi malito
//         'sa.addressList AS dbAddressList'
//       ])
//       .from(ServiceAccounts, 'sa')
//       .where('sa.customerId = :id', { id })
//       .getRawMany();

//     // 3. MIKROTIK INTEGRATION (Real-time Fetch)
//     let finalServices = services.map(s => ({ ...s, isActive: false, statusSource: 'offline' }));

//     try {
//       const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
//       if (activeRouter) {
//         const mt = await getMTConnection(activeRouter.routerId, conn);
//         const response = await mt.get('/ip/dhcp-server/lease');
//         const leases = Array.isArray(response) ? response : (response.data || []);

//         // Itahi ang MikroTik Data sa Database Data
//         finalServices = services.map(service => {
//           const liveLease = leases.find(l => l['mac-address'] === service.macAddress);
          
//           if (liveLease) {
//             // Dito manggagaling ang logic ng status
//             const isAccepted = liveLease['address-lists'] === 'IPOE-ACCEPT';
//             return {
//               ...service,
//               isActive: isAccepted, // Galing na sa MikroTik
//               addressList: liveLease['address-lists'],
//               statusSource: 'live'
//             };
//           }
          
//           // Kung walang nahanap na lease sa MikroTik
//           return { ...service, isActive: false, statusSource: 'not_found_on_router' };
//         });
//       }
//     } catch (mtError) {
//       console.log("Router offline, showing DB status as fallback or empty.");
//       // Option: I-set lahat sa false o ipakita ang huling alam na status sa DB
//       finalServices = services.map(s => ({ ...s, isActive: false, statusSource: 'router_offline' }));
//     }

//     return res.json({
//       ...customer,
//       services: finalServices
//     });

//   } catch (error) {
//     return res.status(500).json({ message: "Error", error: error.message });
//   }
// });

// CustomerRoutes.post("/get-customer", async (req, res) => {
//   try {
//     const { id }: { id: number } = req.body;
//     const conn = await dbConnection();

//     // 1. Kunin ang Basic Customer Info
//     const customer = await conn.manager.createQueryBuilder()
//       .select([
//         'cs.id AS id',
//         'cs.firstName AS firstName',
//         'cs.lastName AS lastName',
//         'cs.middleName AS middleName',
//         'cs.mobileNo AS mobileNo',
//         'cs.address AS address',
//         'cs.email AS email',
//         'cs.pin AS pin'
//       ])
//       .from(Customers, 'cs')
//       .where('cs.id = :id', { id })
//       .getRawOne();

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // 2. Kunin lahat ng Services na naka-link sa Customer na ito
//     const services = await conn.manager.createQueryBuilder()
//       .select([
//         'sa.id AS id',
//         'sa.serviceNumber AS serviceNumber',
//         'sa.ipAddress AS ipAddress',
//         'sa.macAddress AS macAddress',
//         'sa.isActive AS isActive',
//         'pl.name AS planName',
//         'pl.price AS planPrice',
//         'pl.description AS planDescription',
//         'pr.name AS profileName'
//       ])
//       .from(ServiceAccounts, 'sa') // Gamitin ang bagong table mo
//       .leftJoin(Plan, 'pl', 'sa.planId = pl.id')
//       .leftJoin(BandwidthProfile, 'pr', 'pl.profileId = pr.id')
//       .where('sa.customerId = :id', { id })
//       .getRawMany(); // Marami ito kaya Many

//     // 3. I-combine ang result
//     return res.json({
//       ...customer,
//       services: services // Ito yung babasahin ng Table sa React frontend
//     });

//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

CustomerRoutes.post("/save-customer", async (req, res) => {
  try {
    const data = req.body as Customers;

    // Validation for mobile number
    if (!data.mobileNo || data.mobileNo.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Mobile number is required." 
      });
    }

    const conn = await dbConnection();
    const cs = conn.getRepository(Customers);
    const mt = conn.getRepository(Mikrotik);
    const ar = conn.getRepository(ActiveRouter);

    // Dahil sigurado kang laging may record (id: 1)
    const findActiveRouter = await ar.findOneBy({ id: 1 });
    
    // Hanapin ang Mikrotik details
    const activeRouter = await mt.findOneBy({ 
      id: findActiveRouter!.routerId // '!' means sure tayo na hindi ito null
    });

    const existingCustomer = await cs.findOneBy({
      mobileNo: data.mobileNo
    });

    if (existingCustomer && existingCustomer.id !== data.id) {
      return res.status(400).json({ 
        success: false, 
        message: "Mobile number already exists." 
      });
    }

    const customer = new Customers();

    // Mapping fields
    if (data.id) customer.id = data.id;
    customer.firstName = data.firstName;
    customer.lastName = data.lastName;
    customer.middleName = data.middleName;
    customer.email = data.email;
    customer.address = data.address;
    customer.installationDate = data.installationDate;
    customer.ipAddress = data.ipAddress;
    customer.isActive = data.isActive;
    customer.macAddress = data.macAddress;
    customer.mobileNo = data.mobileNo;
    customer.pin = data.pin;
    customer.subscriptionDate = data.subscriptionDate;

    // Dito na papasok yung routerCode logic
    // Gagamitin yung nasa input (data.routerCode), kung wala, kukunin sa Active Router
    customer.routerCode = activeRouter!.code;
    
    await cs.save(customer); 

    return res.json({ 
      success: true, 
      message: data.id ? "Updated!" : "Saved!" 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// CustomerRoutes.post("/save-customer", async (req, res) => {
// 	try {
// 		const data = req.body as Customers;

// 		if (!data.mobileNo || data.mobileNo.trim() === "") {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Mobile number is required and cannot be empty." 
//       });
//     }
// 		const conn = await dbConnection();
// 		const cs = await conn.manager.getRepository(Customers);
// 		const mt = await conn.manager.getRepository(Mikrotik);
// 		const findActiveRouter = await conn.manager.getRepository(ActiveRouter).findOneBy({id: 1});
// 		const activeRouter = await mt.findOneBy( {
// 			id: findActiveRouter.routerId
// 		})

// 		const existingCustomer = await cs.findOneBy({
// 			mobileNo: data.mobileNo
// 		})

// 		if (existingCustomer && existingCustomer.id !== data.id) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Mobile number already exists." 
//       });
//     }

// 		const customer = new Customers();

// 		if (data.id) {
// 			customer.id = data.id;
// 		}

// 		customer.firstName = data.firstName
// 		customer.lastName = data.lastName
// 		customer.middleName = data.middleName
// 		customer.email = data.email
// 		customer.address = data.address
// 		customer.installationDate = data.installationDate
// 		customer.ipAddress = data.ipAddress
// 		customer.isActive = data.isActive
// 		customer.macAddress = data.macAddress
// 		customer.mobileNo = data.mobileNo
// 		customer.pin = data.pin
// 		customer.routerCode = data.routerCode || activeRouter.code
// 		customer.subscriptionDate = data.subscriptionDate
		
// 		await cs.save(customer); 
// 		return res.json({ success: true, message: data.id ? "Updated!" : "Saved!" });
// 	} catch (error) {
// 		console.log(error)
// 		return res.status(500).json({ 
// 			message: error.message, 
// 			error: error.message 
// 		});
// 	}
// })

CustomerRoutes.post("/delete-customer", async (req, res) => {
	try {
		const conn = await dbConnection();
		const repo = conn.getRepository(Customers);
		const { id } = req.body;
		if (!id) {
			return res.status(400).json({ message: 'Missing Profile ID' });
		}

		const cs = await repo.findOne({ where: { id } });
		if (!cs) {
			return res.status(404).json({deleted: false, message: 'Customer not found' });
		}

		await repo.remove(cs);
		res.json({deleted: true, message: `Customer deleted successfully`, id });
		
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
})

// POST /api/management/activate-customer
// CustomerRoutes.post('/activate-customer', async (req, res) => {
//     try {
// 				const conn = await dbConnection();
// 				const repo = conn.getRepository(Customers);
//         const { id, planId, ipAddress, macAddress } = req.body;

//         // 1. Basic Validation
//         if (!id || !planId || !ipAddress || !macAddress) {
//             return res.status(400).json({ message: "Missing required activation fields." });
//         }

//         // 2. Hanapin ang customer sa database
//         const customer = await repo.findOneBy({ id: Number(id) });
//         if (!customer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }

//         // 3. UPDATE ONLY the activation fields
//         // Ito ang sikreto para hindi ma-overwrite ang mobile number mo
//         customer.planId = planId;
//         customer.ipAddress = ipAddress;
//         customer.macAddress = macAddress;
//         customer.isActive = true; // Mark as active na rin

//         await repo.save(customer);

//         // 4. DITO MO PWEDENG ISAMA YUNG MIKROTIK SYNC LOGIC
//         // Halimbawa: Tawagin mo yung function na nag-aadd ng lease sa MikroTik
//         // await syncToMikroTik(customer); 

//         return res.status(200).json({ 
//             message: "Account activated successfully!",
//             data: customer 
//         });

//     } catch (error) {
//         console.error("Activation Error:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// CustomerRoutes.post('/activate-customer', async (req, res) => {
//     try {
//         const conn = await dbConnection();
//         const repo = conn.getRepository(Customers);
        
//         // Kunin ang data mula sa body
//         const { id, planId, ipAddress, macAddress } = req.body;

//         // 1. Validation para sa ID (ito lang ang mandatory dapat)
//         if (!id) {
//             return res.status(400).json({ message: "Customer ID is required." });
//         }

//         // 2. Hanapin ang customer
//         const customer = await repo.findOneBy({ id: Number(id) });
//         if (!customer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }

//         // 3. UPDATE ONLY specific fields
//         // Tatanggap ito ng null values base sa pinasa ng frontend
//         customer.planId = planId || null; 
//         customer.ipAddress = ipAddress || null;
//         customer.macAddress = macAddress || null;

//         // Logic para sa isActive: 
//         // Siguro kung may planId, matik true. Kung wala, false (optional logic ito)
//         customer.isActive = !!planId; 

//         // I-save ang pagbabago
//         // Dahil repo.save(customer) ito, yung mga fields lang na binago natin 
//         // sa itaas ang magagalaw. Safe ang mobileNo at email mo.
//         await repo.save(customer);

//         // 4. MIKROTIK SYNC (Optional)
//         // trigger lang kung may kumpletong technical details
//         if (customer.ipAddress && customer.macAddress && customer.planId) {
//             // await syncToMikroTik(customer);
//             console.log(`Syncing customer ${id} to MikroTik...`);
//         }

//         return res.status(200).json({ 
//             message: "Account updated successfully!",
//             data: customer 
//         });

//     } catch (error) {
//         console.error("Activation Error:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// CustomerRoutes.post('/activate-customer', async (req, res) => {
//     try {
//         const conn = await dbConnection();
//         const repo = conn.getRepository(Customers);
// 				const activeRouter = await conn.manager.getRepository(ActiveRouter).findOneBy({id: 1});
        
//         const { id, planId, ipAddress, macAddress } = req.body;
				

//         if (!id) {
//             return res.status(400).json({ message: "Customer ID is required." });
//         }

//         // 1. MAC ADDRESS DUPLICATE CHECK
//         // I-check lang natin kung may laman yung macAddress na pinasa
//         if (macAddress) {
//             const existingMac = await repo.findOne({
//                 where: { 
//                     macAddress: macAddress,
//                     id: Not(Number(id)) as any 
//                 }
//             });

//             if (existingMac) {
//                 return res.status(400).json({ 
//                     message: `MAC Address ${macAddress} is already assigned to another customer (${existingMac.firstName} ${existingMac.lastName}).` 
//                 });
//             }
//         }



//         // 2. Hanapin ang customer na ia-activate
//         const customer = await repo.findOneBy({ id: Number(id) });
//         if (!customer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }

//         // 3. UPDATE fields
//         customer.planId = planId || null; 
//         customer.ipAddress = ipAddress || null;
//         customer.macAddress = macAddress || null;
//         // customer.isActive = !!planId; 

//         await repo.save(customer);

// 				const mt = await getMTConnection(activeRouter.routerId, conn)
// 				const response = await mt.get('/ip/dhcp-server/lease');
//         const leases = Array.isArray(response) ? response : (response.data || []);
// 				const targetLease = leases.find(l => l['mac-address'] === macAddress);

// 				if (targetLease) {
//           await mt.post('/ip/dhcp-server/lease/.action/set', {
// 						".id": targetLease['.id'],      // Dapat may dot (.) sa unahan ang id
// 						"address-lists": 'IPOE-ACCEPT'
// 					});
//         }

//         // 4. MIKROTIK SYNC
//         if (customer.ipAddress && customer.macAddress && customer.planId) {
//             console.log(`Syncing customer ${id} to MikroTik...`);
//         }

//         return res.status(200).json({ 
//             message: "Account activated successfully!",
//             data: customer 
//         });

//     } catch (error) {
//         console.error("Activation Error:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// CustomerRoutes.post('/add-service', async (req, res) => {
//     try {
//         const conn = await dbConnection();
//         const repo = conn.getRepository(Customers);
        
//         // 1. Safety Check para sa Active Router
//         const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
//         if (!activeRouter) {
//             return res.status(500).json({ message: "Active router configuration not found." });
//         }

//         const { id, planId, ipAddress, macAddress, fullName } = req.body;

//         if (!id) {
//             return res.status(400).json({ message: "Customer ID is required." });
//         }

//         // 2. MAC ADDRESS DUPLICATE CHECK
//         if (macAddress) {
//             const existingMac = await repo.findOne({
//                 where: { 
//                     macAddress: macAddress,
//                     id: Not(id) as any
//                 }
//             });

//             if (existingMac) {
//                 return res.status(400).json({ 
//                     message: `MAC Address ${macAddress} is already assigned to ${existingMac.firstName} ${existingMac.lastName}.` 
//                 });
//             }
//         }

//         const customer = await repo.findOneBy({ id: Number(id) });
//         if (!customer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }

//         // 3. UPDATE DATABASE FIRST
//         customer.planId = planId || null; 
//         customer.ipAddress = ipAddress || null;
//         customer.macAddress = macAddress || null;
//         await repo.save(customer);

//         // 4. MIKROTIK SYNC (Dito ang critical part)
//         try {
//             const mt = await getMTConnection(activeRouter.routerId, conn);
            
//             // Sa Axios, ang listahan ay nasa .data
//             const response = await mt.get('/ip/dhcp-server/lease');
//             const leases = response.data; // Standard for Mikrotik REST API

						
//             const targetLease = leases.find(l => l['mac-address'] === macAddress);

//             if (targetLease) {
//                 const leaseId = targetLease['.id'];

//     // 1. Kung dynamic pa ang lease, gawin muna nating static
// 									if (targetLease.dynamic === "true" || targetLease.dynamic === true) {
// 											await mt.post('/ip/dhcp-server/lease/make-static', {
// 													".id": leaseId
// 											});
// 											console.log("Lease converted to static.");
// 									}

// 									// 2. Ngayon, i-set na natin ang address-lists (Gamit ang .action/set)
// 									await mt.post('/ip/dhcp-server/lease/set', {
// 											".id": leaseId,
// 											"address-lists": "IPOE-DROP",
// 											"comment": `${fullName}`
// 									});

// 									const hehe = await generateAutoNumber('CID_NO', conn)
// 									console.log({hehe:hehe})

// 									console.log(`MikroTik: Lease for ${macAddress} is now Static and in IPOE-ACCEPT`);
//             } else {
//                 console.warn(`MikroTik: No active lease found for MAC ${macAddress}`);
//             }
//         } catch (mtError) {
// 					console.log(mtError)
//             // I-log lang ang error pero huwag i-fail ang request dahil naka-save na sa DB
//             console.error("MikroTik Sync Failed:", mtError.message);
//         }

//         return res.status(200).json({ 
//             message: "Account activated successfully!",
//             data: customer 
//         });

//     } catch (error) {
//         console.error("Activation Error:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

CustomerRoutes.post('/add-service', async (req, res) => {
    try {
        const conn = await dbConnection();
        // Gagamitin na natin ang ServiceAccounts repository
        const serviceRepo = conn.getRepository(ServiceAccounts);
        const customerRepo = conn.getRepository(Customers);

        const activeRouter = await conn.getRepository(ActiveRouter).findOneBy({ id: 1 });
        if (!activeRouter) {
            return res.status(500).json({ message: "Active router configuration not found." });
        }

        const { id, planId, ipAddress, macAddress, fullName } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Customer ID is required." });
        }

        // 1. MAC ADDRESS DUPLICATE CHECK (Sa ServiceAccounts na tayo magche-check)
        if (macAddress) {
            const existingService = await serviceRepo.findOneBy({ macAddress: macAddress });
            if (existingService) {
                return res.status(400).json({ 
                    message: `MAC Address ${macAddress} is already assigned to Service No: ${existingService.serviceNumber}.` 
                });
            }
        }

        // 2. GENERATE UNIQUE SERVICE NUMBER (Yung SQL Function mo)
        const nextServiceNo = await generateAutoNumber('SVC_NO', conn);

        // 3. INSERT SA SERVICE ACCOUNTS TABLE (Hindi na Update sa Customer)
        const newService = serviceRepo.create({
            serviceNumber: nextServiceNo,
            customerId: Number(id),
            planId: planId || null,
            ipAddress: ipAddress || null,
            macAddress: macAddress || null,
            addressList: 'IPOE-DROP', // Default upon creation
            routerCode: activeRouter.routerCode // O kung anong column name mo para sa router identifier
        });

        await serviceRepo.save(newService);

        // 4. MIKROTIK SYNC
        try {
            const mt = await getMTConnection(activeRouter.routerId, conn);
            const response = await mt.get('/ip/dhcp-server/lease');
            const leases = response.data;

            const targetLease = leases.find(l => l['mac-address'] === macAddress);

            if (targetLease) {
                const leaseId = targetLease['.id'];

                if (targetLease.dynamic === "true" || targetLease.dynamic === true) {
                    await mt.post('/ip/dhcp-server/lease/make-static', { ".id": leaseId });
                }

                await mt.post('/ip/dhcp-server/lease/set', {
                    ".id": leaseId,
                    "address-lists": "IPOE-DROP",
                    "comment": `SN: ${nextServiceNo} - ${fullName}` // Mas maganda kung kasama Service No sa comment
                });

                console.log(`MikroTik Sync Success for SN: ${nextServiceNo}`);
            }
        } catch (mtError) {
            console.error("MikroTik Sync Failed:", mtError.message);
        }

        return res.status(200).json({ 
            message: "Service account created and linked successfully!",
            serviceNumber: nextServiceNo,
            data: newService 
        });

    } catch (error) {
        console.error("Add Service Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});