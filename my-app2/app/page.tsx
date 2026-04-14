'use client';

import { Box, Button, Container, Flex, Stack, Text } from "@chakra-ui/react";

const Home = () => {
  const handleClick = () => {
    alert("Button clicked");
  }

  const motion = {
    durations: {
      fast: '0.2s',
      normal: '0.4s',
      slow: '0.6s',
    },
    easings: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    }
  };

  return (
			<>
				<Stack >
					<Button onClick={handleClick} size="sm">
						Click me
					</Button>

					<Box
						transition={`all ${motion.durations.normal} ${motion.easings.easeIn}`}
						_hover={{ transform: 'scale(1.05)' }}
						p={4}
						bg="white"
						borderRadius="md"
						shadow="md"
						>
						Hover me
					</Box>

					<Box>
						Main content goes here...
					</Box>
				</Stack>
			</>
      
  );
}

export default Home;
// export default withAuth(Home);