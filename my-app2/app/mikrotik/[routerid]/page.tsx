'use client'
import { Box, Table, Text } from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export interface DhcpLeaseTyped {
  ".id": string;          // May quotes dapat sa interface
  name: string;
  interface: string;
  "lease-time": string;   // Dash-case property
  "address-pool": string;
  disabled: string;
  dynamic: string;
  invalid: string;
  "use-radius": string;
  ".about": string;
}

export default function Test() {
  const { routerid } = useParams()

	const [data, setData] = useState<DhcpLeaseTyped[]>([])

	const hasFetched = useRef(false);

	 useEffect(() => {
    if (!routerid) return

		 hasFetched.current = true;

    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/mikrotik/get-server', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ routerid }),
        })
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [routerid])
	console.log(data)
  return (
		<Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader>Name</Table.ColumnHeader>
        <Table.ColumnHeader>Interface</Table.ColumnHeader>
        <Table.ColumnHeader>Lease Time</Table.ColumnHeader>
        <Table.ColumnHeader>Status</Table.ColumnHeader>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {/* Siguraduhin na array ang data bago mag-map */}
      {Array.isArray(data) && data.map((server: DhcpLeaseTyped) => (
        <Table.Row key={server['.id']}>
          <Table.Cell>{server.name}</Table.Cell>
          <Table.Cell>{server.interface}</Table.Cell>
          <Table.Cell>{server['lease-time']}</Table.Cell>
          <Table.Cell>{server['.about']}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
	)
}