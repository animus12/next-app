'use client'

import { Box, Button, Flex, Table, Badge, Heading, Input, Select, Link, Field, Dialog, Portal, Stack, createListCollection, HStack, Icon, IconButton } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { FiPlus, FiEye, FiEdit } from "react-icons/fi"
import { Toaster, toaster } from '@/components/ui/toaster'
import NextLink from 'next/link'
import { RiDeleteBin5Line } from "react-icons/ri"
import { GrView } from "react-icons/gr";




export interface IPlan {
		id?: number; // Optional para sa 'Create', Required para sa 'Update'
		name: string;
		description: string | null;
		price: number | null;
		profileId: number | null;
	}

	export interface ICustomer {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  mobileNo: string; // Required (NOT NULL)
  pin?: string;
  planId?: number | null;
  routerCode?: string;
  ipAddress?: string;
  macAddress?: string;
  subscriptionDate?: Date | string;
  installationDate?: Date | string;
  isActive: boolean;
  
  // Optional: Kung i-fefetch mo kasama ang Plan data
  plan?: IPlan; 
}
	
	export interface IJoinedPlan {
		id?: number; // Optional para sa 'Create', Required para sa 'Update'
		name: string;
		description: string | null;
		price: number | null;
		profileId:  number | null;
		profileName: string
	}
	
	
	
	interface IBandwidthProfile {
		id: number;
		name: string;
	}
	
	
	export const Demo = ({ onSuccess, editData, isOpen, onClose, onOpen }: { 
  onSuccess: () => void, 
  editData: ICustomer | null, // Change to any or ICustomer if passing customer data
  isOpen: boolean,
  onClose: () => void,
  onOpen: () => void
}) => {
  const ref = useRef<HTMLInputElement | null>(null)
  
  // Siguraduhin na ang initial state ay tumutugma sa ICustomer fields
  const [formData, setFormData] = useState<Partial<ICustomer>>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/management/save-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

			const data = await response.json()
			if (!response.ok) {
				 toaster.create({
						title: "Warning",
						description: data.message || "Something went wrong",
						type: "info",
					});
				throw new Error(data.message || "Something went wrong");
			}

      toaster.create({
        title: "Success",
        description: formData.id ? "Customer updated!" : "New customer added!",
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData(editData);
      } else {
        // Reset to empty customer fields
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          mobileNo: "",
          address: "",
          isActive: false,
        });
      }
    }
  }, [editData, isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} initialFocusEl={() => ref.current}>
      <Dialog.Trigger asChild>
        {/* <Button variant="solid" colorPalette="blue" onClick={onOpen}>
          <FiPlus /> Add Customer
        </Button> */}
				{!editData && (
					<Dialog.Trigger asChild>
						<Button variant="solid" colorPalette="blue" onClick={onOpen}>
							<FiPlus /> Add Customer
						</Button>
					</Dialog.Trigger>
				)}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width="1200px" maxWidth="95vw">
            <Dialog.Header>
              <Dialog.Title fontSize={25}>
                {formData.id ? "Edit Customer" : "Create Customer"}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="4">
              <Stack gap="4">
                <HStack gap="4">
                  <Field.Root>
                    <Field.Label fontWeight="bold">First Name</Field.Label>
                    <Input
                      name="firstName" // DAPAT TUGMA SA INTERFACE
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      placeholder="Juan"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label fontWeight="bold">Middle Name</Field.Label>
                    <Input
                      name="middleName"
                      value={formData.middleName || ""}
                      onChange={handleChange}
                      placeholder="Dela"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label fontWeight="bold">Last Name</Field.Label>
                    <Input
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      placeholder="Cruz"
                    />
                  </Field.Root>
                </HStack>

                <HStack gap="4">
                  <Field.Root flex="1">
                    <Field.Label fontWeight="bold">Email</Field.Label>
                    <Input
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="juan@example.com"
                    />
                  </Field.Root>
                  <Field.Root flex="1">
                    <Field.Label fontWeight="bold">Mobile #</Field.Label>
                    <Input
                      name="mobileNo"
                      value={formData.mobileNo || ""}
                      onChange={handleChange}
                      placeholder="09123456789"
                    />
                  </Field.Root>
                </HStack>

                <Field.Root>
                  <Field.Label fontWeight="bold">Address</Field.Label>
                  <Input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    placeholder="Enter Full Address"
                  />
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleSave} colorPalette="blue">
                Save Customer
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default function Customer() {
  const router = useRouter()
	const [customers, setCustomers] = useState<ICustomer[]>([])
	const [selectedProfile, setSelectedProfile] = useState<ICustomer | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchCustomers = async () => {
		try {
			const res = await fetch('http://localhost:4000/api/management/get-customers', {
			method: 'GET',
			credentials: 'include', 
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		const data = await res.json()
		setCustomers(data)
		} catch (err) {
			console.error(err)
		}
	}

	const handleAdd = () => {
		setSelectedProfile(null);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: number) => {
			try {
				const response = await fetch('http://localhost:4000/api/management/delete-customer', {
					method: 'POST', 
					credentials: 'include', 
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id }) 
				});
	
				const result = await response.json();
	
				if (!response.ok) throw new Error(result.message || 'Failed to delete');
	
				toaster.create({
					title: "Deleted",
					description: result.message,
					type: "success",
				});
	
				// Optional: refresh table after delete
				fetchCustomers(); // tawagin ulit yung function mo para mag re-fetch ng routers
	
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				toaster.create({
					title: "Error",
					description: errorMessage,
					type: "error",
				});
			}
		}

	const handleEdit = (customer: ICustomer) => {
		setSelectedProfile(customer);
		setIsModalOpen(true);
	};


	useEffect(() => {
			const loadData = async () => {
				await fetchCustomers();
			};
		
			loadData();
		}, [])
  // Sample Data (Dito mo tatawagin yung API mo mamaya)

  return (
		<>
    <Box rounded="lg" shadow="md" p="4" bg="white" border="1px solid" borderColor="gray.200" w="100%" overflowX="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Customer Management</Heading>

				 <Flex justify="space-between" align="center">
					<Input placeholder="Subtle" variant="subtle" />
					<Demo 
						editData={selectedProfile} 
						onSuccess={fetchCustomers}
						isOpen={isModalOpen}
						onOpen={handleAdd}
						onClose={() => setIsModalOpen(false)}
					/>

				 </Flex>
      </Flex>

      <Table.Root size="sm" variant="outline" interactive>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Mobile</Table.ColumnHeader>
            <Table.ColumnHeader>IP Address</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer.id}>
              <Table.Cell fontWeight="medium">{customer.firstName}</Table.Cell>
              <Table.Cell>{customer.mobileNo}</Table.Cell>
              <Table.Cell>{customer.ipAddress}</Table.Cell>
              <Table.Cell>
               	<Badge colorPalette={customer.isActive ? "green" : "red"}>
									{customer.isActive ? "Active" : "Inactive"}
								</Badge>
              </Table.Cell>
              <Table.Cell textAlign="right">
								<Button 
									variant="ghost" 
									colorPalette="green" 
									rounded="full" 
									size="xs" 
									padding={0} // Siguraduhin na sakop ng link ang buong button area
								>
									<NextLink 
										href={`/management/customers/${customer.id}`} 
										style={{ 
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'center', 
											width: '100%', 
											height: '100%' 
										}}
									>
										<Icon size="sm"><GrView /></Icon>
									</NextLink>
								</Button>

								<Button colorPalette="blue"  variant="ghost" rounded="full" size="xs" onClick={() => handleEdit(customer)} >
									<Icon size="sm"><FiEdit /></Icon>
								</Button>
								<Button colorPalette="red"  variant="ghost" rounded="full" size="xs" onClick={() => handleDelete(customer.id)}>
									<Icon size="sm"><RiDeleteBin5Line /></Icon>
								</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    	</Box>
			<Toaster />
	</>
  )
}