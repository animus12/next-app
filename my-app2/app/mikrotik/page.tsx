'use client'

import { Badge, Box, Button, createListCollection, Field, HStack, Icon, Input, Link, Portal, Select, Stack, Switch, Table, Text } from '@chakra-ui/react'
import { Toaster, toaster } from "@/components/ui/toaster"
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import NextLink from 'next/link'

export interface MikrotikData {
  id?: number | null;
  name: string;
  ipDomain: string;
  code: string;
  username: string;
  password: string;
  port: string;
  isActive: boolean;
}

export interface Mikrotik {
	id: number ;
  name: string;
  ipDomain: string;
	code: string;
  username: string;
  password: string;
  port: string;
  isActive: boolean;
  status: boolean;
}

export default function Mikrotik() {
  const [formData, setFormData] = useState<MikrotikData>({
    id: null,
    name: '',
    ipDomain: '',
    code: '',
    username: '',
    password: '',
    port: '',
    isActive: false
  })

  const [routers, setRouters] = useState<Mikrotik[]>([])
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Fetch routers
  const fetchRouters = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/mikrotik/get-router')
      const data = await res.json()
      setRouters(data)
    } catch (err) {
      console.error(err)
    }
  }

  // Socket + initial fetch
  useEffect(() => {
    const socket = io('http://localhost:4000')
    // socket.on('interface-stats', handler)

		socket.on('router-status-updated', (updatedItem: Mikrotik) => {
      setRouters(prev => prev.map(r => r.id === updatedItem.id ? updatedItem : r))
    })

    fetchRouters() // initial table load

    return () => {
      socket.off('router-status-updated')
      socket.disconnect()
    }
  }, [])

  // Save / Verify router
  const handleSaveAndVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.ipDomain.trim() || !formData.username.trim()) {
      toaster.create({
        title: "Validation Error",
        description: "Lahat ng may asterisk (*) ay kailangang sagutan.",
        type: "error",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/mikrotik/save-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          ipDomain: formData.ipDomain.trim(),
          username: formData.username.trim(),
          password: formData.password.trim()
        }),
      })
      const result = await response.json()
			console.log(result)
      if (!response.ok) throw new Error(result.message || 'Failed to save data')

      toaster.create({
        title: "Success",
        description: formData.id ? "Router details updated!" : "New router added!",
        type: "success",
      })

      if (response.ok) {
       
      }

      fetchRouters() // ✅ refresh table after save

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toaster.create({
        title: "System Error",
        description: errorMessage,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Edit router
  const handleEdit = (data: MikrotikData) => {
    setFormData(data)
  }

	const clearField = () => {
		setFormData({
			id: null,
			name: '',
			ipDomain: '',
			code: '',
			username: '',
			password: '',
			port: '',
			isActive: false
		})
	}

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch('http://localhost:4000/api/mikrotik/delete-router', {
				method: 'POST', // o DELETE, depende sa API mo
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }) // <-- dito lang ang kailangan
			});

			const result = await response.json();

			if (!response.ok) throw new Error(result.message || 'Failed to delete');

			toaster.create({
				title: "Deleted",
				description: `Router with ID ${id} has been deleted`,
				type: "success",
			});

			// Optional: refresh table after delete
			fetchRouters(); // tawagin ulit yung function mo para mag re-fetch ng routers

		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			toaster.create({
				title: "Error",
				description: errorMessage,
				type: "error",
			});
		}
	}

  // Disable button if form incomplete
  const isButtonDisabled =
    loading ||
    !formData.name.trim() ||
    !formData.ipDomain.trim() ||
    !formData.username.trim()

  return (
		<>
		
    <HStack gap="10" alignItems="top">
      <Box rounded="lg" shadow="md" p="8" bg="white" border="1px solid" borderColor="gray.200" w="30%">
        <form onSubmit={handleSaveAndVerify}>
          <Stack gap="5">
            <Field.Root invalid={!formData.name.trim() && loading === false}>
              <Field.Label fontWeight="bold">Router Name <Box as="span" color="red.500" ml="1">*</Box></Field.Label>
              <Input name="name" placeholder="e.g. Core Router Main" value={formData.name} onChange={handleChange} />
            </Field.Root>

						<Field.Root invalid={!formData.code.trim() && loading === false}>
              <Field.Label fontWeight="bold">Code <Box as="span" color="red.500" ml="1">*</Box></Field.Label>
              <Input name="code" placeholder="code" value={formData.code} onChange={handleChange} />
            </Field.Root>

            <Field.Root invalid={!formData.ipDomain.trim() && loading === false}>
              <Field.Label fontWeight="bold">Cloud DNS / IP Address <Box as="span" color="red.500" ml="1">*</Box></Field.Label>
              <Input name="ipDomain" placeholder="xxxx.sn.mynetname.net" value={formData.ipDomain} onChange={handleChange} />
            </Field.Root>

            <Field.Root invalid={!formData.username.trim() && loading === false}>
              <Field.Label fontWeight="bold">API Username <Box as="span" color="red.500" ml="1">*</Box></Field.Label>
              <Input name="username" placeholder="admin" value={formData.username} onChange={handleChange} />
            </Field.Root>

            <Field.Root invalid={!formData.password && loading === false}>
              <Field.Label fontWeight="bold">API Password <Box as="span" color="red.500" ml="1">*</Box></Field.Label>
              <Input type="password" name="password" placeholder="********" value={formData.password} onChange={handleChange} />
            </Field.Root>

            <Field.Root>
              <Field.Label fontWeight="bold">Port</Field.Label>
              <Input name="port" value={formData.port} onChange={handleChange} />
            </Field.Root>

            <Switch.Root
              name="isActive"
              checked={formData.isActive ?? false}
              onCheckedChange={(e) => setFormData(prev => ({ ...prev, isActive: e.checked }))}
            >
              <Switch.Label>Is Active</Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>

           
						<HStack>
							<Button
								type="submit"
								colorPalette="blue"
								size="lg"
								loading={loading}
								disabled={isButtonDisabled}
								width="50%"
								mt="2"
							>
								{formData.id ? "Update " : "Save "}
							</Button>

						<Button
              colorPalette="orange"
              size="lg"
							onClick={() => clearField()}
              loading={loading}
              disabled={isButtonDisabled}
              width="50%"
              mt="2"
            >
             Clear
            </Button>
						</HStack>
						
          </Stack>
        </form>
      </Box>

     
      <Box rounded="lg" shadow="md" p="8" bg="white" border="1px solid" borderColor="gray.200" w="70%">
        <Stack gap="10">
          <Table.Root size="sm" variant="outline" interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Domain</Table.ColumnHeader>
                <Table.ColumnHeader>Code</Table.ColumnHeader>
                <Table.ColumnHeader>Product</Table.ColumnHeader>
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>Is Active</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {routers.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
										 <Box
												w="3"
												h="3"
												rounded="full"
												bg={item.status ? "green.500" : item.status ? "red.500" : "gray.300"}
												boxShadow={item.status ? "0 0 8px var(--chakra-colors-green-400)" : "none"}
											/>
									</Table.Cell>
									 <Table.Cell>
										<Link as={NextLink} href={`/mikrotik/${item.id}`}>
											{item.ipDomain}
										</Link>
									</Table.Cell>
                  <Table.Cell>{item.code}</Table.Cell>
                 
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.username}</Table.Cell>
                  <Table.Cell>{item.isActive ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>
                    <Button colorPalette="blue"  variant="ghost" rounded="full" size="xs" onClick={() => handleEdit(item)}>
                      <Icon size="sm"><FiEdit /></Icon>
                    </Button>
                    <Button colorPalette="red"  variant="ghost" rounded="full" size="xs" onClick={() => handleDelete(item.id)}>
                      <Icon size="sm"><RiDeleteBin5Line /></Icon>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Stack>
      </Box>
			<Toaster />
    </HStack>
		<HStack gap="10" alignItems="top" mt={5}>
			<ActiveRouter router={routers} />		
		</HStack>
		</>
  )
}

const ActiveRouter = ({ router }: { router: Mikrotik[] }) => {
  const [selectedId, setSelectedId] = useState<string[]>([]);

 const routerCollection = createListCollection({
		items: router
			.filter((p) => p.status === true) 
			.map((p) => ({
				label: p.ipDomain,
				value: JSON.stringify({ id: p.id, code: p.code }),
			})),
	});

  // --- ETO YUNG DAGDAG PARA SA DEFAULT VALUE ---
  // useEffect(() => {
  //   const fetchDefault = async () => {
  //     const response = await fetch('http://localhost:4000/api/mikrotik/get-active-router');
  //     const data = await response.json();
      
  //     if (data && data.routerId) {
  //       // I-set ang selectedId base sa nakuha sa database
  //       setSelectedId([data.routerId.toString()]);
  //     }
  //   };
  //   fetchDefault();
  // }, []); // Takbo lang pagka-load ng page
		useEffect(() => {
			const fetchDefault = async () => {
				try {
					const response = await fetch('http://localhost:4000/api/mikrotik/get-active-router');
					const data = await response.json();
					
					// Dito tayo magbabago:
					if (data && data.routerId && data.routerCode) {
						// Dapat ay eksaktong format ng JSON string na nasa Collection
						const matchValue = JSON.stringify({ id: data.routerId, code: data.routerCode });
						setSelectedId([matchValue]);
					}
				} catch (err) {
					console.error("Fetch default error:", err);
				}
			};
			fetchDefault();
		}, []);
  // --------------------------------------------

  const handleSave = async () => {
		
    await fetch('http://localhost:4000/api/mikrotik/save-active-router', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routerid: selectedId[0] }),
    });

    toaster.create({
      title: "Success",
      description: `Active Router Selected`,
      type: "success",
    });
  };

  return (
    <Box p="4" bg="white" border="1px solid" borderColor="gray.200" rounded="lg">
      <Select.Root 
        collection={routerCollection} 
        value={selectedId} // Eto yung magpapakita ng default sa UI
        onValueChange={(details) => setSelectedId(details.value)}
      >
        <Select.Label>Select Active Router</Select.Label>
        <Select.Control>
          <Select.Trigger>
            {/* ValueText ang bahala magpakita ng label nung selectedId */}
            <Select.ValueText placeholder="Pili ka rito" />
          </Select.Trigger>
        </Select.Control>
        
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {routerCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      <Button onClick={handleSave} mt={4} width="full" colorScheme="blue">
        Save Router
      </Button>
    </Box>
  );
};