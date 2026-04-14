'use client'

import { Box, Button, createListCollection, Dialog, Field, Flex, Heading, HStack, Icon, Input, Link, Portal, Select, Stack, Table } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import NextLink from 'next/link'
import { useRef } from "react"
import { Toaster, toaster } from '@/components/ui/toaster'

export interface IPlan {
  id?: number; // Optional para sa 'Create', Required para sa 'Update'
  name: string;
  description: string | null;
  price: number | null;
  profileId: number | null;
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


const Demo = (
	{ 
		onSuccess, 
		editData, 
		isOpen, 
		onClose, 
		onOpen 
	}: { 
		onSuccess: () => void, 
		editData: IJoinedPlan | null,
		isOpen: boolean,
		onClose: () => void,
		onOpen: () => void
	}
) => {
	const ref = useRef<HTMLInputElement | null>(null)
	const [availableProfiles, setAvailableProfiles] = useState<IBandwidthProfile[]>([]);

	const [formData, setFormData] = useState<IJoinedPlan>({
		name: "",
		description: "",
		price: null,
		profileId: null,
		profileName: ""
	});

	const profileCollection = createListCollection({
  items: availableProfiles.map((p) => ({
    label: p.name,
    value: p.id.toString(), // I-convert ang ID to string dito
  })),
});

	const fetchAvailableProfiles = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/menu/get-profile', { // Palitan ang URL base sa actual API mo
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      setAvailableProfiles(data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = async () => {
		try {
			const response = await fetch('http://localhost:4000/api/menu/save-plan', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData),
			})
		
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.message || "Something went wrong");
			}

			toaster.create({
				title: "Success",
				description: formData.id ? "Profile updated!" : "New profile added!",
				type: "success",
			});

			onSuccess(); // Refresh table
			onClose();   // Close modal
			} catch (error) {
				console.log(error)
			}
	};

	useEffect(() => {
  const initModal = async () => {
    if (isOpen) {
      // 1. Hintayin munang matapos ang pag-load ng profiles
      await fetchAvailableProfiles();

      // 2. Pagkatapos ma-load, saka i-set ang formData
      if (editData) {
        setFormData({
          ...editData,
          // Siguraduhin na ang profileId ay number o string na mag-mamatch sa collection
          profileId: editData.profileId ? Number(editData.profileId) : null
        });
      } else {
        setFormData({
          name: "", 
          description: "", 
          price: null, 
          profileName: "", 
          profileId: null
        });
      }
    }
  };

  initModal();
}, [editData, isOpen]);

	

 return (
		<Dialog.Root  open={isOpen} onOpenChange={(e) => !e.open && onClose()} initialFocusEl={() => ref.current}>
			<Dialog.Trigger asChild>
				<Button variant="solid" colorPalette="blue"  onClick={onOpen}>
					Add Plan
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title fontSize={25}>Create Plan</Dialog.Title>
						</Dialog.Header>

						<Dialog.Body pb="4">
							{/* Ginamit ko ang Stack na may gap="4" para pantay ang layo ng mga fields */}
							<Stack gap="4">
								{/* Plan Name */}
								<Field.Root>
									<Field.Label fontWeight="bold">Plan Name</Field.Label>
									<Input
										ref={ref}
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="Enter Plan Name"
									/>
								</Field.Root>

								{/* Description */}
								<Field.Root>
									<Field.Label fontWeight="bold">Description</Field.Label>
									<Input
										name="description"
										value={formData.description || ""}
										onChange={handleChange}
										placeholder="Enter Description"
									/>
								</Field.Root>
								<Select.Root 
									collection={profileCollection} 
									size="sm" 
									width="full"
									// I-convert ang profileId sa string array para mag-match sa collection
									value={formData.profileId ? [formData.profileId.toString()] : []} 
									onValueChange={(e) => {
										const val = e.value[0];
										setFormData({ ...formData, profileId: val ? Number(val) : null });
									}}
									>
									<Select.Label fontWeight="bold">Profile</Select.Label>
									<Select.Control>
										<Select.Trigger>
											<Select.ValueText placeholder="Select Profile" />
										</Select.Trigger>
									</Select.Control>

									<Select.Positioner>
										<Select.Content>
											{profileCollection.items.map((item) => (
												<Select.Item item={item} key={item.value}>
													{item.label}
													<Select.ItemIndicator />
												</Select.Item>
											))}
										</Select.Content>
									</Select.Positioner>
								</Select.Root>
						
           
								<Field.Root>
									<Field.Label fontWeight="bold">Price</Field.Label>
									<Input
										name="price"
										value={formData.price || ""}
										onChange={handleChange}
										placeholder="Enter Price"
									/>
								</Field.Root>
							</Stack>
						</Dialog.Body>

						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button onClick={handleSave} colorPalette="blue">
								Save Plan
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

export default function Plan() {
	const [profile, setProfile] = useState<IJoinedPlan[]>([])
	const [selectedProfile, setSelectedProfile] = useState<IJoinedPlan | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	

	const fetchProfiles = async () => {
		try {
			const res = await fetch('http://localhost:4000/api/menu/get-plan', {
			method: 'GET',
			credentials: 'include', 
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		const data = await res.json()
		setProfile(data)
		} catch (err) {
			console.error(err)
		}
	}

	const handleEdit = (item: IJoinedPlan) => {

		console.log({ace: item})
		setSelectedProfile(item);
		setIsModalOpen(true);
	};

	const handleAdd = () => {
		setSelectedProfile(null);
		setIsModalOpen(true);
	};

		const handleDelete = async (id: number | null | undefined) => {
			try {
				const response = await fetch('http://localhost:4000/api/menu/delete-plan', {
					method: 'POST', 
					credentials: 'include', 
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id }) 
				});
		
				const result = await response.json();
		
				if (!response.ok) throw new Error(result.message || 'Failed to delete');
		
				toaster.create({
					title: "Deleted",
					description: `Profile has been deleted`,
					type: "success",
				});
		
				// Optional: refresh table after delete
				fetchProfiles(); // tawagin ulit yung function mo para mag re-fetch ng routers
		
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				toaster.create({
					title: "Error",
					description: errorMessage,
					type: "error",
				});
			}
		}

	useEffect(() => {
		const loadData = async () => {
			await fetchProfiles();
		};
	
		loadData();
	}, [])
	return (
		<>
			

			<Box rounded="lg" shadow="md" p="4" bg="white" border="1px solid" borderColor="gray.200" w="100%" overflowX="auto">
				
			

			 		<Flex justify="space-between" align="center" mb={6}>
							<Heading size="lg">Customer Management</Heading>
							<Flex justify="space-between" align="center">
									<Input placeholder="Subtle" variant="subtle" />
									<Demo 
										editData={selectedProfile} 
										onSuccess={fetchProfiles}
										isOpen={isModalOpen}
										onOpen={handleAdd}
										onClose={() => setIsModalOpen(false)}
									/>
							 </Flex>
					</Flex>
				<Stack gap="4">
					<Table.Root size="sm" variant="outline" interactive>
						<Table.Header>
							<Table.Row bg="gray.50">
								<Table.ColumnHeader>Profile Name</Table.ColumnHeader>
								<Table.ColumnHeader>Description</Table.ColumnHeader>
								<Table.ColumnHeader>Profile</Table.ColumnHeader>
								<Table.ColumnHeader>Price</Table.ColumnHeader>
								<Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{profile.length > 0 ? (
								profile.map((item) => (
									<Table.Row key={item.id}>
										<Table.Cell fontWeight="medium">{item.name}</Table.Cell>
										<Table.Cell>{item.description}</Table.Cell>
										<Table.Cell color="blue.600">{item.profileName}</Table.Cell>
										<Table.Cell color="orange.600">{item.price}</Table.Cell>
										<Table.Cell textAlign="right">
											<HStack gap="2" justifyContent="flex-end">
												<Button size="xs"  rounded="full" variant="ghost" colorPalette="blue" onClick={() => handleEdit(item)}>
													<Icon><FiEdit /></Icon>
												</Button>
												<Button size="xs"  rounded="full" variant="ghost" colorPalette="red" 	onClick={() => handleDelete(item.id)}>
													<Icon><RiDeleteBin5Line /></Icon>
												</Button>
											</HStack>
										</Table.Cell>
									</Table.Row>
								))
							) : (
								<Table.Row>
									<Table.Cell colSpan={6} textAlign="center" py="4">
										No profiles found.
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table.Root>
				</Stack>
			</Box>
			<Toaster />
		</>
	)
}


