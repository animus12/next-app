'use client'

import { Box, Button, Dialog, Field, Flex, Heading, HStack, Icon, Input, Link, Portal, Stack, Table } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import NextLink from 'next/link'
import { useRef } from "react"
import { Toaster, toaster } from '@/components/ui/toaster'

export interface BandwidthProfile {
  id?: number | null; // Optional para sa 'Create', Required para sa 'Update'
  name: string;
  downloadRate: string;
  uploadRate: string;
  dlBurstRate: string;
  ulBurstRate: string;
  dlThresholdRate: string;
  ulThresholdRate: string;
  dlBurstTime: string;
  ulBurstTime: string;
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
		editData: BandwidthProfile | null,
		isOpen: boolean,
		onClose: () => void,
		onOpen: () => void
	}
) => {
  const ref = useRef<HTMLInputElement | null>(null)

	const [formData, setFormData] = useState<BandwidthProfile>({
    name: "",
    downloadRate: "",
    uploadRate: "",
    dlBurstRate: "",
    ulBurstRate: "",
    dlThresholdRate: "",
    ulThresholdRate: "",
    dlBurstTime: "",
    ulBurstTime: "",
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
			const response = await fetch('http://localhost:4000/api/menu/save-profile', {
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

		const loadDatas = async () => {
			 if (editData) {
				setFormData(editData);
			} else {
				// Reset form kung "Add Profile" ang pinindot
				setFormData({
					name: "", downloadRate: "", uploadRate: "", dlBurstRate: "",
					ulBurstRate: "", dlThresholdRate: "", ulThresholdRate: "",
					dlBurstTime: "", ulBurstTime: "",
				});
			}
		}

		loadDatas()
   
  }, [editData, isOpen]);

	

 return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} initialFocusEl={() => ref.current}>
      <Dialog.Trigger asChild>
        <Button variant="solid" colorPalette="blue" onClick={onOpen}>Add Profile</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize={25}>Create Speed Profile</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                {/* Profile Name */}
                <Field.Root>
                  <Field.Label fontWeight="bold">Profile Name</Field.Label>
                  <Input 
                    ref={ref}
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. 5Mbps_Solo" 
                  />
                </Field.Root>

                {/* Rates */}
                <HStack gap="4">
                  <Field.Root>
                    <Field.Label fontWeight="bold">Download Rate</Field.Label>
                    <Input name="downloadRate" value={formData.downloadRate} onChange={handleChange} placeholder="5M" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label fontWeight="bold">Upload Rate</Field.Label>
                    <Input name="uploadRate" value={formData.uploadRate} onChange={handleChange} placeholder="2M" />
                  </Field.Root>
                </HStack>

                {/* Burst Rates */}
                <HStack gap="4">
                  <Field.Root>
                    <Field.Label fontWeight="bold">Download Burst</Field.Label>
                    <Input name="dlBurstRate" value={formData.dlBurstRate} onChange={handleChange} placeholder="10M" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label fontWeight="bold">Upload Burst</Field.Label>
                    <Input name="ulBurstRate" value={formData.ulBurstRate} onChange={handleChange} placeholder="4M" />
                  </Field.Root>
                </HStack>

                {/* Thresholds */}
                <HStack gap="4">
                  <Field.Root>
                    <Field.Label fontWeight="bold">Download Threshold</Field.Label>
                    <Input name="dlThresholdRate" value={formData.dlThresholdRate} onChange={handleChange} placeholder="4M" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label fontWeight="bold">Upload Threshold</Field.Label>
                    <Input name="ulThresholdRate" value={formData.ulThresholdRate} onChange={handleChange} placeholder="1M" />
                  </Field.Root>
                </HStack>

                {/* Burst Times */}
                <HStack gap="4">
                  <Field.Root>
                    <Field.Label fontWeight="bold">Download Burst Time</Field.Label>
                    <Input name="dlBurstTime" value={formData.dlBurstTime} onChange={handleChange} placeholder="8s" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label fontWeight="bold">Upload Burst Time</Field.Label>
                    <Input name="ulBurstTime" value={formData.ulBurstTime} onChange={handleChange} placeholder="8s" />
                  </Field.Root>
                </HStack>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleSave} colorPalette="blue">Save Profile</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default function Profile() {
	const [profile, setProfile] = useState<BandwidthProfile[]>([])
	const [selectedProfile, setSelectedProfile] = useState<BandwidthProfile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchProfiles = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/menu/get-profile', {
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

	const handleEdit = (item: BandwidthProfile) => {
    setSelectedProfile(item);
    setIsModalOpen(true);
  };

	const handleAdd = () => {
    setSelectedProfile(null);
    setIsModalOpen(true);
  };

		const handleDelete = async (id: number | null | undefined) => {
			try {
				const response = await fetch('http://localhost:4000/api/menu/delete-profile', {
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
                <Table.ColumnHeader>Rate (D/U)</Table.ColumnHeader>
                <Table.ColumnHeader>Burst (D/U)</Table.ColumnHeader>
                <Table.ColumnHeader>Threshold (D/U)</Table.ColumnHeader>
                <Table.ColumnHeader>Burst Time</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {profile.length > 0 ? (
                profile.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell fontWeight="medium">{item.name}</Table.Cell>
                    <Table.Cell>{item.downloadRate} / {item.uploadRate}</Table.Cell>
                    <Table.Cell color="blue.600">{item.dlBurstRate} / {item.ulBurstRate}</Table.Cell>
                    <Table.Cell color="orange.600">{item.dlThresholdRate} / {item.ulThresholdRate}</Table.Cell>
                    <Table.Cell>{item.dlBurstTime} / {item.ulBurstTime}</Table.Cell>
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
