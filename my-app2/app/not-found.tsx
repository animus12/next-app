"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <Box
			position="fixed" // overlay sa buong screen
			top={0}
			left={0}
			w="100vw"
			h="100vh"
			bg="rgba(255, 255, 255, 1)" // semi-transparent background
			zIndex={9999} // siguraduhing nasa ibabaw
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
				<VStack colorPalette="teal">
				<Spinner color="teal.600" fontSize={200} size='xl' />
				<Text color="cyan.500">Redirecting...</Text>
			</VStack>
		</Box>
  );
}