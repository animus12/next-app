"use client";

import { useBear } from "@/store/user-store";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
	const { setBear } = useBear()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

			const data = await res.json();

			console.log(data)

      if (data.status === 200) {
        // ⏳ 2-second delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
				setBear(`${data.user.lastName || ''}, ${data.user.firstName || ''}`)
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box p={6} rounded="md" bg="white" shadow="md" w="96">
        <Stack>
          <Text fontSize="2xl" fontWeight="bold">
            Login
          </Text>
          <Input placeholder="Username" name="username" />
          <Input placeholder="Password" type="password" name="password" />

          <Button
            type="submit"
            colorScheme="blue"
            loading={loading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </Stack>
      </Box>
    </form>
  );
}