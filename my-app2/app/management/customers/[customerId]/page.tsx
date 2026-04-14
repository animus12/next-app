'use client'

import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  VStack, 
  HStack, 
  Stack,
  Separator, 
  Badge, 
  Flex,
  Icon,
  Card,
  IconButton,
	Button,
	Input,
	Select,
	createListCollection
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import React, { ElementType, useEffect, useState } from 'react'
import { 
  MdPerson, MdPhone, MdEmail, MdLocationOn, 
  MdRouter, MdReceipt, MdVisibility, MdVisibilityOff, MdLock, 
	MdEdit,
	MdSettings
} from 'react-icons/md'
import { Demo } from '../page'
import { toaster, Toaster } from '@/components/ui/toaster'
import { CustomModal } from '@/components/activate-modal'
import { FaSync } from 'react-icons/fa'

export interface CustomerInfo {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string ;
  mobileNo: string;
  address: string;
  pin: string;
  ipAddress: string;
  macAddress: string;
  email: string;
  planName: string;
  planDescription: string;
  planPrice: number;
  profilename: string;
	isActive: boolean;
	services: ServiceAccount[];
}

export interface ServiceAccount {
  id: number;
  serviceNumber: string;
  ipAddress: string;
  macAddress: string;
  isActive: boolean;
  planName: string;
  planPrice: number;
  planDescription: string;
  profileName: string;
  addressList: string;
	isLive: boolean;
	mikrotikMsg: string;
	leaseStatus: string;
	
}

interface ISelect {
  id: number;
  name: string;
}

export interface IJoinedPlan {
  id?: number; // Optional para sa 'Create', Required para sa 'Update'
  name: string;
  description: string | null;
  price: number | null;
	profileId:  number | null;
	profileName: string
}

export interface MikroTikDhcpLease {
  ".id": string;
  "address": string;
  "address-lists": string;
  "blocked": string; // String ito kasi galing sa API ("false")
  "dhcp-option": string;
  "disabled": string;
  "dynamic": string;
  "last-seen": string;
  "mac-address": string;
  "radius": string;
  "status": string;
}

export default function Customer() {
  const { customerId } = useParams()
  const [customer, setCustomer] = useState<CustomerInfo>()
  const [showPin, setShowPin] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)

	const [isModalOpen, setIsModalOpen] = useState(false)
	// const [selectedPlan, setSelectedPlan] = useState()
	// const [selectedDhcp, setSelectedDhcp] = useState()
const [selectedPlan, setSelectedPlan] = useState<string[]>([])
const [selectedDhcp, setSelectedDhcp] = useState<string[]>([])

	const [getPlan, setGetPlan] = useState<IJoinedPlan[]>([])
	const [getdDhcp, setGetDhcp] = useState<MikroTikDhcpLease[]>([])

	const getQuery = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/management/get-customer', {
          method: 'POST', 
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(customerId) }) 
      });
      const data = await response.json();
			console.log(data)
      setCustomer(data)
    } catch (error) {
      console.error("Error fetching customer:", error)
    }
  }

		const fetchAvailablePlans = async () => {
			try {
			const res = await fetch('http://localhost:4000/api/menu/get-plan', {
				method: 'GET',
				credentials: 'include', 
				headers: {
					'Content-Type': 'application/json'
				}
			});
				const data = await res.json();
				setGetPlan(data);
			} catch (err) {
				console.error("Error fetching profiles:", err);
			}
		};

		const fetchAvailableDhcp = async () => {
			try {
				const res = await fetch('http://localhost:4000/api/mikrotik/get-dhcp-lease', { // Palitan ang URL base sa actual API mo
					method: 'GET',
					credentials: 'include',
				});

				const data = await res.json();
				setGetDhcp(data);
			} catch (err) {
				console.error("Error fetching profiles:", err);
			}
		};

	const plans = createListCollection({
		items: [
			{ label: "---", value: "" },
			...getPlan.map((p) => ({
				label: `${p.name} - ${p.profileName}`,
				value: String(p.id),
			})),
		],
	})

	const dhcps = createListCollection({
		items: [
			{ label: "---", value: "" }, 
				...getdDhcp.map((p) => ({
					label: `${p['address']} - ${p['mac-address']}`,
					value: `${p['address']}|${p['mac-address']}`, 
				})),
		] 
	})

	const handleSave = async () => {
		try {
			// Kunin ang raw values mula sa state (string arrays sa Chakra v3)
			const rawPlanId = selectedPlan[0] || "";
			const rawDhcpValue = selectedDhcp[0] || "";

			// I-handle ang IP at MAC split nang maingat
			let selectedIp = null;
			let selectedMac = null;

			if (rawDhcpValue && rawDhcpValue !== "") {
				const parts = rawDhcpValue.split('|');
				selectedIp = parts[0];
				selectedMac = parts[1];
			}

			// I-prepare ang payload. Kung "" ang value, isend ay null.
			const payload = {
				id: Number(customerId),
				planId: rawPlanId === "" ? null : Number(rawPlanId),
				ipAddress: selectedIp,
				macAddress: selectedMac,
				fullName: `FirtName: ${customer?.firstName}, LastName: ${customer?.lastName}`
			};

			// API Call
			const response = await fetch('http://localhost:4000/api/management/add-service', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				setOpenEdit(false);
				getQuery(); // Refresh data sa main page
				
				toaster.create({
					title: "Success",
					description: 'Customer data updated successfully',
					type: "success",
				});
			} else {
				const err = await response.json();
				toaster.create({
					title: "Update Failed",
					description: err.message || 'Something went wrong',
					type: "error",
				});
			}

		} catch (error) {
			console.error("Error saving customer data:", error);
			toaster.create({
				title: "Error",
				description: 'Internal Server Error',
				type: "error",
			});
		}
	};

	const unbindDhcpLease = async (no: string) => {
		try {
			const res = await fetch('http://localhost:4000/api/mikrotik/unbind-mac-ip', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({serviceNumber: no, customerId: customer?.id}),
			});

			const data = await res.json()

			getQuery()
			console.log(data)
		} catch (error) {
			
		}
	}

const handleEnable = async (serviceNo: string) => {
  try {
    const res = await fetch('http://localhost:4000/api/mikrotik/toggle-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ serviceNumber: serviceNo }),
    });

    if (res.ok) {
      const data = await res.json();
      toaster.create({
        title: "Status Updated",
        description: data.message,
        type: "info",
      });
      getQuery(); // Refresh table data
    }
  } catch (error) {
    console.error("Toggle error:", error);
  }
};

	useEffect(() => {
		const fn = async () => {
			if (customerId) await getQuery()

				fetchAvailablePlans()
				fetchAvailableDhcp()
		}
		fn()
  }, [customerId])
	
	useEffect(() => {
		const fn = async () => {
			if (openEdit && customer && getPlan.length > 0) {    
				const currentPlan = getPlan.find(p => p.name === customer.planName);
				if (currentPlan) {
					setSelectedPlan([String(currentPlan.id)]);
				}

				// I-format ang IP at MAC para mag-match sa value ng collection mo
				if (customer.ipAddress && customer.macAddress) {
					const combinedValue = `${customer.ipAddress}|${customer.macAddress}`;
					setSelectedDhcp([combinedValue]);
				} else {
					setSelectedDhcp([]); // Clear kung walang data
				}
  		}
		}

		fn()
}, [openEdit, customer, getPlan]);

  if (!customer) return <Box p="5">Loading customer data...</Box>

  return (
    <Box p={{ base: "4", md: "8" }} bg="gray.50" minH="100vh">
      <Stack gap="6" maxW="1200px" mx="auto">
        
        {/* HEADER CARD */}
        <Card.Root variant="elevated" rounded="xl" border="1px solid" borderColor="gray.200">
          <Card.Body p="6">
            <Flex justify="space-between" align="center" wrap="wrap" gap="4">
              <HStack gap="4">
                <Box bg="blue.600" p="3" rounded="full" color="white">
                  <Icon size="xl">
                    <MdPerson />
                  </Icon>
                </Box>
                <VStack align="start" gap="0">
                  <Heading size="md">{customer.firstName} {customer.lastName}</Heading>
                  <HStack bg="gray.100" px="2" py="1" rounded="md">
                    <MdLock size="12" color="gray" />
                    <Text color="fg.muted" fontSize="xs" fontWeight="bold">PIN:</Text>
                    <Text fontSize="sm" fontWeight="mono" letterSpacing="widest">
                      {showPin ? customer.pin : "••••••"}
                    </Text>
                    <IconButton
                      aria-label="Toggle PIN"
                      variant="ghost"
                      size="xs"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </HStack>
                </VStack>
              </HStack>
							<HStack gap="3">
                {/* 3. EDIT BUTTON SA HEADER */}
								<Button 
                  colorPalette="green" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setOpenEdit(true)}
                >
                  <Icon><MdEdit /></Icon> Add Service
                </Button>
								<CustomModal 
									isOpen={openEdit} 
									onClose={() => setOpenEdit(false)}
									title="Edit Customer Profile"
									size="lg"
									footer={
										<>
											<Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
											<Button colorPalette="blue" onClick={handleSave}>Save Changes</Button>
										</>
									}
								>
								
									<VStack gap="5" align="stretch">
										<Select.Root 
											collection={plans} 
											value={selectedPlan}
											onValueChange={(e) => setSelectedPlan( e.value)}
										>
											<HStack w="full" justify="space-between">
												<Select.Label fontWeight="bold" fontSize="xs">SERVICE PLAN</Select.Label> 
												<IconButton
													onClick={() => fetchAvailableDhcp()}
													aria-label="Refresh DHCP"
													variant="ghost"   // Para walang background box
													color="green.500" // Dito mo ite-set ang kulay ng icon
													_hover={{ color: "green.600", bg: "transparent" }} // Hover effect na walang grey box
													size="sm"
													minW={0} // Tinatanggal ang default minimum width ng button
													p={2}    // Konting padding lang para madaling i-click
												>
											<FaSync /> Sync
										</IconButton>
											</HStack>
											<Select.Control>
												<Select.Trigger>
													<Select.ValueText placeholder="Select Plan" />
													<Select.Indicator />
												</Select.Trigger>
											</Select.Control>
											<Select.Positioner>
												<Select.Content>
													{plans.items.map((item) => (
														<Select.Item item={item} key={item.value}>
															{item.label}
														</Select.Item>
													))}
												</Select.Content>
											</Select.Positioner>
										</Select.Root>

										{/* DROPDOWN 2: STATUS */}
										<Select.Root 
											collection={dhcps} 
											value={selectedDhcp}
											onValueChange={(e) => setSelectedDhcp(e.value)}
										>
											<Select.Label fontWeight="bold" fontSize="xs">BIND MAC-ADDRESS</Select.Label>
											<Select.Control>
												<Select.Trigger>
													<Select.ValueText placeholder="Select IP/MAC Address" />
													<Select.Indicator />
												</Select.Trigger>
											</Select.Control>
											<Select.Positioner>
												<Select.Content>
													{dhcps.items.map((item) => (
														<Select.Item item={item} key={item.value}>
															{item.label}
														</Select.Item>
													))}
												</Select.Content>
											</Select.Positioner>
										</Select.Root>
									</VStack>
								</CustomModal>
                <Button 
                  colorPalette="blue" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsModalOpen(true)}
                >
                  <Icon><MdEdit /></Icon> Edit Profile
                </Button>

                <VStack align="end" gap="1">
                  <Badge colorPalette="purple" size="lg" variant="subtle">{customer.profilename}</Badge>
                  <Text fontSize="xs" color="fg.subtle">ID: {customerId}</Text>
                </VStack>
              </HStack>
            </Flex>
          </Card.Body>
        </Card.Root>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
          
        
          <Card.Root variant="outline" bg="white">
            <Card.Header pb="2">
              <Heading size="xs" color="fg.muted" letterSpacing="wider">CONTACT DETAILS</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap="5">
                <InfoRow icon={MdPhone} label="Mobile" value={customer.mobileNo} />
                <InfoRow icon={MdEmail} label="Email" value={customer.email} />
                <InfoRow icon={MdLocationOn} label="Address" value={customer.address} />
              </VStack>
            </Card.Body>
          </Card.Root>

         
          {/* <Card.Root variant="outline" bg="white" borderTop="4px solid" borderColor="blue.500">
            <Card.Header pb="2">
              <Heading size="xs" color="fg.muted" letterSpacing="wider">SERVICE PLAN</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap="2">
                <Text fontWeight="bold" fontSize="xl">{customer.planName}</Text>
                <Text fontSize="3xl" color="blue.600" fontWeight="black">
                  ₱{Number(customer.planPrice).toLocaleString()}
                </Text>
                <Text fontSize="sm" color="fg.muted">{customer.planDescription}</Text>
                
                <Separator my="4" />
                
                <HStack color="fg.muted">
                  <MdReceipt />
                  <Text fontSize="xs">Status: <Badge colorPalette="green" variant="outline">Active</Badge></Text>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root> */}

          {/* TECHNICAL DETAILS */}
          {/* <Card.Root variant="outline" bg="white">
            <Card.Header pb="2">
							<HStack justify='space-between' w='full'>
            	  <Heading size="xs" color="fg.muted" letterSpacing="wider">NETWORK INFO</Heading>
								<HStack justify='space-between'>
									<Button size='xs' onClick={unbindDhcpLease}>Unbind IP</Button>
									<Button size='xs' onClick={unbindDhcpLease}>Enable</Button>
								</HStack>
							</HStack>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap="5">
                <InfoRow icon={MdRouter} label="IP Address" value={customer.ipAddress} />
                <InfoRow icon={MdRouter} label="MAC Address" value={customer.macAddress} />
              </VStack>
            </Card.Body>
          </Card.Root> */}

        </SimpleGrid>

				<Card.Root variant="outline" bg="white" rounded="xl" overflow="hidden">
           <Card.Header borderBottomWidth="1px" p="4" bg="gray.50">
             <HStack justify="space-between">
               <Heading size="sm">Service Accounts</Heading>
               <Badge variant="solid">{false || 0} Total</Badge>
             </HStack>
           </Card.Header>
           <Box overflowX="auto">
             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ textAlign: 'left', borderBottom: '1px solid #edf2f7', fontSize: '12px', color: '#718096' }}>
                   <th style={{ padding: '15px' }}>SERVICE NO.</th>
                   <th style={{ padding: '15px' }}>PLAN & PROFILE</th>
                   <th style={{ padding: '15px' }}>IP / MAC ADDRESS</th>
                   <th style={{ padding: '15px' }}>STATUS</th>
                   <th style={{ padding: '15px', textAlign: 'right' }}>ACTIONS</th>
                 </tr>
               </thead>
               <tbody>
                 {(customer.services || []).map((svc) => (
                   <tr key={svc.serviceNumber} style={{ borderBottom: '1px solid #edf2f7' }}>
                     <td style={{ padding: '15px' }}>
                       <Text fontWeight="bold" color="blue.600" fontSize="sm">{svc.serviceNumber}</Text>
                     </td>
                     <td style={{ padding: '15px' }}>
                       <VStack align="start" gap="0">
                         <Text fontSize="sm" fontWeight="medium">{svc.planName}</Text>
                         <Text fontSize="xs" color="gray.500">{svc.profileName}</Text>
                       </VStack>
                     </td>
                     <td style={{ padding: '15px' }}>
                       <VStack align="start" gap="0">
                         <Text fontSize="xs" fontFamily="mono">{svc.ipAddress}</Text>
                         <Text fontSize="xs" color="gray.400" fontFamily="mono">{svc.macAddress}</Text>
                       </VStack>
                     </td>
                     <td style={{ padding: '15px' }}>
											<VStack align="start" gap="0">
                       	<Text fontSize="sm" fontWeight="medium">{svc.leaseStatus}</Text>
												<Text fontSize="xs" fontFamily="mono">{svc.mikrotikMsg}</Text>
                       </VStack>
                     </td>
                     <td style={{ padding: '15px', textAlign: 'right' }}>
                       <HStack gap="2" justify="flex-end">
                         <IconButton size="xs" variant="ghost" aria-label="Sync" onClick={() => handleEnable(svc.serviceNumber)}>
													<Badge colorPalette={svc.isActive ? "green" : "red"} variant="subtle">
														{svc.isActive ? "ACTIVE" : "DISABLED"}
													</Badge>
												 </IconButton>
                         <IconButton size="xs" variant="ghost" aria-label="Sync" onClick={() => unbindDhcpLease(svc.serviceNumber)}>OP</IconButton>
                         <IconButton size="xs" variant="ghost" colorPalette="blue" aria-label="Settings"><MdSettings /></IconButton>
                       </HStack>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </Box>
         </Card.Root>

				<Demo 
          isOpen={isModalOpen}
          onOpen={() => setIsModalOpen(true)}
          onClose={() => setIsModalOpen(false)}
          editData={customer} // I-pasa ang data ng kasalukuyang user
          onSuccess={getQuery} // Kapag nag-save, tatawagin uli ang getQuery para refresh ang data sa page
        />
      </Stack>
				<Toaster />
    </Box>
  )
}

// Sub-component para sa malinis na listahan
function InfoRow({ icon, label, value }: { icon: ElementType, label: string, value: string }) {
  return (
    <HStack align="start" gap="3">
      <Icon color="blue.500" mt="1">
        {React.createElement(icon)}
      </Icon>
      <VStack align="start" gap="0">
        <Text fontSize="xs" color="fg.subtle" fontWeight="bold" textTransform="uppercase">{label}</Text>
        <Text fontSize="sm" color="fg.emphasized">{value || '---'}</Text>
      </VStack>
    </HStack>
  )
}
// ###########################################################
// 'use client'

// import { 
//   Box, Heading, Text, SimpleGrid, VStack, HStack, Stack,
//   Separator, Badge, Flex, Icon, Card, IconButton, Button,
//   Table
// } from '@chakra-ui/react'
// import { useParams } from 'next/navigation'
// import React, { ElementType, useEffect, useState } from 'react'
// import { 
//   MdPerson, MdPhone, MdEmail, MdLocationOn, 
//   MdRouter, MdReceipt, MdVisibility, MdVisibilityOff, MdLock, 
//   MdEdit, MdSettings
// } from 'react-icons/md'
// import { Demo } from '../page'
// import { toaster, Toaster } from '@/components/ui/toaster'
// import { CustomModal } from '@/components/activate-modal'
// import { FaSync } from 'react-icons/fa'
// import { Select } from '@chakra-ui/react'
// import { createListCollection } from '@chakra-ui/react'

// // --- INTERFACES ---

// export interface ServiceAccount {
//   id: number;
//   serviceNumber: string;
//   ipAddress: string;
//   macAddress: string;
//   isActive: boolean;
//   planName: string;
//   planPrice: number;
//   planDescription: string;
//   profileName: string;
// }

// export interface CustomerInfo {
//   id: number;
//   firstName: string;
//   lastName: string;
//   middleName: string;
//   mobileNo: string;
//   address: string;
//   pin: string;
//   email: string;
//   services: ServiceAccount[]; // Bagong structure mula sa backend
// }

// export interface IJoinedPlan {
//   id?: number;
//   name: string;
//   description: string | null;
//   price: number | null;
//   profileId: number | null;
//   profileName: string;
// }

// export interface MikroTikDhcpLease {
//   ".id": string;
//   "address": string;
//   "mac-address": string;
//   "status": string;
// }

// export default function Customer() {
//   const { customerId } = useParams()
//   const [customer, setCustomer] = useState<CustomerInfo>()
//   const [showPin, setShowPin] = useState(false)
//   const [openEdit, setOpenEdit] = useState(false)
//   const [isModalOpen, setIsModalOpen] = useState(false)
  
//   const [selectedPlan, setSelectedPlan] = useState<string[]>([])
//   const [selectedDhcp, setSelectedDhcp] = useState<string[]>([])
//   const [getPlan, setGetPlan] = useState<IJoinedPlan[]>([])
//   const [getdDhcp, setGetDhcp] = useState<MikroTikDhcpLease[]>([])

//   const getQuery = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/api/management/get-customer', {
//           method: 'POST', 
//           credentials: 'include', 
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id: Number(customerId) }) 
//       });
//       const data = await response.json();
//       setCustomer(data)
//     } catch (error) {
//       console.error("Error fetching customer:", error)
//     }
//   }

//   const fetchAvailablePlans = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/api/menu/get-plan', {
//         method: 'GET',
//         credentials: 'include', 
//       });
//       const data = await res.json();
//       setGetPlan(data);
//     } catch (err) {
//       console.error("Error fetching plans:", err);
//     }
//   };

//   const fetchAvailableDhcp = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/api/mikrotik/get-dhcp-lease', {
//         method: 'GET',
//         credentials: 'include',
//       });
//       const data = await res.json();
//       setGetDhcp(data);
//     } catch (err) {
//       console.error("Error fetching DHCP:", err);
//     }
//   };

//   const plans = createListCollection({
//     items: [
//       { label: "---", value: "" },
//       ...getPlan.map((p) => ({
//         label: `${p.name} - ${p.profileName}`,
//         value: String(p.id),
//       })),
//     ],
//   })

//   const dhcps = createListCollection({
//     items: [
//       { label: "---", value: "" }, 
//       ...getdDhcp.map((p) => ({
//         label: `${p['address']} - ${p['mac-address']}`,
//         value: `${p['address']}|${p['mac-address']}`, 
//       })),
//     ] 
//   })

//   const handleSave = async () => {
//     try {
//       const rawPlanId = selectedPlan[0] || "";
//       const rawDhcpValue = selectedDhcp[0] || "";
//       let selectedIp = null, selectedMac = null;

//       if (rawDhcpValue && rawDhcpValue !== "") {
//         const parts = rawDhcpValue.split('|');
//         selectedIp = parts[0];
//         selectedMac = parts[1];
//       }

//       const payload = {
//         id: Number(customerId),
//         planId: rawPlanId === "" ? null : Number(rawPlanId),
//         ipAddress: selectedIp,
//         macAddress: selectedMac,
//         fullName: `${customer?.firstName} ${customer?.lastName}`
//       };

//       const response = await fetch('http://localhost:4000/api/management/add-service', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         setOpenEdit(false);
//         getQuery();
//         toaster.create({ title: "Success", description: 'New service added', type: "success" });
//       }
//     } catch (error) {
//       console.error("Error saving:", error);
//     }
//   };

//   useEffect(() => {
// 		const fn = () => {
// 			if (customerId) {
// 				getQuery();
// 				fetchAvailablePlans();
// 				fetchAvailableDhcp();
// 			}

// 		}
// 		fn()
//   }, [customerId])

//   if (!customer) return <Box p="5">Loading customer data...</Box>

//   // Para sa Summary Cards, kukunin natin ang pinaka-unang service kung meron
//   const primaryService = customer.services?.[0];

//   return (
//     <Box p={{ base: "4", md: "8" }} bg="gray.50" minH="100vh">
//       <Stack gap="6" maxW="1200px" mx="auto">
        
//         {/* HEADER CARD */}
//         <Card.Root variant="elevated" rounded="xl" border="1px solid" borderColor="gray.200">
//           <Card.Body p="6">
//             <Flex justify="space-between" align="center" wrap="wrap" gap="4">
//               <HStack gap="4">
//                 <Box bg="blue.600" p="3" rounded="full" color="white">
//                   <Icon size="xl"><MdPerson /></Icon>
//                 </Box>
//                 <VStack align="start" gap="0">
//                   <Heading size="md">{customer.firstName} {customer.lastName}</Heading>
//                   <HStack bg="gray.100" px="2" py="1" rounded="md">
//                     <MdLock size="12" color="gray" />
//                     <Text color="fg.muted" fontSize="xs" fontWeight="bold">PIN:</Text>
//                     <Text fontSize="sm" fontWeight="mono">{showPin ? customer.pin : "••••••"}</Text>
//                     <IconButton aria-label="Toggle PIN" variant="ghost" size="xs" onClick={() => setShowPin(!showPin)}>
//                       {showPin ? <MdVisibilityOff /> : <MdVisibility />}
//                     </IconButton>
//                   </HStack>
//                 </VStack>
//               </HStack>
              
//               <HStack gap="3">
//                 <Button colorPalette="green" variant="outline" size="sm" onClick={() => setOpenEdit(true)}>
//                   <Icon><MdRouter /></Icon> Add Service
//                 </Button>
//                 <Button colorPalette="blue" variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
//                   <Icon><MdEdit /></Icon> Edit Profile
//                 </Button>
//                 <VStack align="end" gap="1">
//                   <Badge colorPalette="purple" size="lg" variant="subtle">CUSTOMER ID</Badge>
//                   <Text fontSize="xs" color="fg.subtle">#{customerId}</Text>
//                 </VStack>
//               </HStack>
//             </Flex>
//           </Card.Body>
//         </Card.Root>

//         <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
//           {/* CONTACT INFO */}
//           <Card.Root variant="outline" bg="white">
//             <Card.Header pb="2"><Heading size="xs" color="fg.muted">CONTACT DETAILS</Heading></Card.Header>
//             <Card.Body>
//               <VStack align="start" gap="5">
//                 <InfoRow icon={MdPhone} label="Mobile" value={customer.mobileNo} />
//                 <InfoRow icon={MdEmail} label="Email" value={customer.email} />
//                 <InfoRow icon={MdLocationOn} label="Address" value={customer.address} />
//               </VStack>
//             </Card.Body>
//           </Card.Root>

//           {/* PRIMARY SERVICE INFO */}
//           <Card.Root variant="outline" bg="white" borderTop="4px solid" borderColor="blue.500">
//             <Card.Header pb="2"><Heading size="xs" color="fg.muted">PRIMARY PLAN</Heading></Card.Header>
//             <Card.Body>
//               <VStack align="start" gap="2">
//                 <Text fontWeight="bold" fontSize="xl">{primaryService?.planName || 'No Service'}</Text>
//                 <Text fontSize="3xl" color="blue.600" fontWeight="black">
//                   ₱{primaryService ? Number(primaryService.planPrice).toLocaleString() : '0'}
//                 </Text>
//                 <Text fontSize="sm" color="fg.muted">{primaryService?.planDescription || 'Add a service to start.'}</Text>
//                 <Separator my="4" />
//                 <HStack color="fg.muted">
//                   <MdReceipt />
//                   <Text fontSize="xs">Status: <Badge colorPalette={primaryService?.isActive ? "green" : "gray"}>{primaryService?.isActive ? "Active" : "None"}</Badge></Text>
//                 </HStack>
//               </VStack>
//             </Card.Body>
//           </Card.Root>

//           {/* PRIMARY NETWORK INFO */}
//           <Card.Root variant="outline" bg="white">
//             <Card.Header pb="2"><Heading size="xs" color="fg.muted">PRIMARY NETWORK</Heading></Card.Header>
//             <Card.Body>
//               <VStack align="start" gap="5">
//                 <InfoRow icon={MdRouter} label="IP Address" value={primaryService?.ipAddress || '---'} />
//                 <InfoRow icon={MdRouter} label="MAC Address" value={primaryService?.macAddress || '---'} />
//               </VStack>
//             </Card.Body>
//           </Card.Root>
//         </SimpleGrid>

//         {/* --- SERVICE LIST TABLE --- */}
//         <Card.Root variant="outline" bg="white" rounded="xl" overflow="hidden">
//           <Card.Header borderBottomWidth="1px" p="4" bg="gray.50">
//             <HStack justify="space-between">
//               <Heading size="sm">Service Accounts</Heading>
//               <Badge variant="solid">{customer.services?.length || 0} Total</Badge>
//             </HStack>
//           </Card.Header>
//           <Box overflowX="auto">
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ textAlign: 'left', borderBottom: '1px solid #edf2f7', fontSize: '12px', color: '#718096' }}>
//                   <th style={{ padding: '15px' }}>SERVICE NO.</th>
//                   <th style={{ padding: '15px' }}>PLAN & PROFILE</th>
//                   <th style={{ padding: '15px' }}>IP / MAC ADDRESS</th>
//                   <th style={{ padding: '15px' }}>STATUS</th>
//                   <th style={{ padding: '15px', textAlign: 'right' }}>ACTIONS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customer.services?.map((svc) => (
//                   <tr key={svc.id} style={{ borderBottom: '1px solid #edf2f7' }}>
//                     <td style={{ padding: '15px' }}>
//                       <Text fontWeight="bold" color="blue.600" fontSize="sm">{svc.serviceNumber}</Text>
//                     </td>
//                     <td style={{ padding: '15px' }}>
//                       <VStack align="start" gap="0">
//                         <Text fontSize="sm" fontWeight="medium">{svc.planName}</Text>
//                         <Text fontSize="xs" color="gray.500">{svc.profileName}</Text>
//                       </VStack>
//                     </td>
//                     <td style={{ padding: '15px' }}>
//                       <VStack align="start" gap="0">
//                         <Text fontSize="xs" fontFamily="mono">{svc.ipAddress}</Text>
//                         <Text fontSize="xs" color="gray.400" fontFamily="mono">{svc.macAddress}</Text>
//                       </VStack>
//                     </td>
//                     <td style={{ padding: '15px' }}>
//                       <Badge colorPalette={svc.isActive ? "green" : "red"} variant="subtle">
//                         {svc.isActive ? "ACTIVE" : "DISABLED"}
//                       </Badge>
//                     </td>
//                     <td style={{ padding: '15px', textAlign: 'right' }}>
//                       <HStack gap="2" justify="flex-end">
//                         <IconButton size="xs" variant="ghost" aria-label="Sync"><FaSync /></IconButton>
//                         <IconButton size="xs" variant="ghost" colorPalette="blue" aria-label="Settings"><MdSettings /></IconButton>
//                       </HStack>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Box>
//         </Card.Root>

//         {/* MODALS */}
//         <Demo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editData={customer} onSuccess={getQuery} />
        
//         <CustomModal 
//           isOpen={openEdit} 
//           onClose={() => setOpenEdit(false)} 
//           title="Add New Service Account"
//           footer={<><Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button><Button colorPalette="blue" onClick={handleSave}>Add Service</Button></>}
//         >
//           <VStack gap="5" align="stretch">
//              {/* Plan Select & DHCP Select components here... */}
//           </VStack>
//         </CustomModal>

//       </Stack>
//       <Toaster />
//     </Box>
//   )
// }

// function InfoRow({ icon, label, value }: { icon: ElementType, label: string, value: string }) {
//   return (
//     <HStack align="start" gap="3">
//       <Icon color="blue.500" mt="1">{React.createElement(icon)}</Icon>
//       <VStack align="start" gap="0">
//         <Text fontSize="xs" color="fg.subtle" fontWeight="bold" textTransform="uppercase">{label}</Text>
//         <Text fontSize="sm" color="fg.emphasized">{value || '---'}</Text>
//       </VStack>
//     </HStack>
//   )
// }