'use client'

import { Provider } from "@/components/ui/provider"
import { Box, Button, Container, Flex, Stack, Text,
	Accordion, 
	Span,
	SkeletonText,
 } from "@chakra-ui/react";

 import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
 
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import { useBear } from "@/store/user-store";
import { LiaSlashSolid } from "react-icons/lia";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
	const pathname = usePathname()
	const router = useRouter();
	const {bears, clearBear} = useBear()

	const activeCategory = settings.find((cat) =>
    cat.links.some((link) => link.href === pathname)
  );
	const activeLink = activeCategory?.links.find((link) => link.href === pathname);

	const handleLogout = async () => {
			await fetch("http://localhost:4000/api/auth/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // 🔥 IMPORTANT for cookies
			});

			 clearBear();

			router.replace("/login"); // 🔥 redirect agad
	}

	if (pathname === '/login' ) 
		return (
    <html suppressHydrationWarning>
      <body>
				  <Provider>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
							{children}  {/* dito lang lalabas ang login form */}
						</div>
					</Provider>
      </body>
    </html>
  )

  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
					<Container maxW={{ base: 'full', md: '10/12', lg: '8/12' }} px={{ base: 4, md: 8, lg: 0 }}>
							<Box  
								as="header"
								position="sticky"
								top="0"
								zIndex="1000"
								bg="white"
								boxShadow="sm"
								p={4}
								h="85px"

								display="flex"                // 🔥 enable flex
								alignItems="center"           // center vertically
								justifyContent="space-between" // 🔥 left & right
							>
								<Text w='50%' fontSize="2xl" fontWeight="bold" color="blue.500">
									My Billing Website
								</Text>

								{bears?
									<Text w='50%' textAlign='right' fontSize="lg" fontWeight="bold" color="blue.500">
										{bears}
									</Text>:
									<SkeletonText alignSelf='end' w='100px' noOfLines={1}></SkeletonText>
								}
							</Box>

							<Flex minH="100vh" >
								<Box
									bg="bg.muted"
									w="300px"
									position="sticky"
									top="87px" // adjust kung may header height
									h="calc(100vh - 90px)" // full height minus header
									p={4}
									overflowY="auto"
								>
								
									<Stack  h='11/12'   py='6'>
											<Link
												as={NextLink}
												href="/"
												p={2}
												rounded="md"
												fontWeight="bold"
												color={pathname === "/" ? "red.500" : "black"}
												_hover={{
													textDecor: "none",
													boxShadow: "md",
													bg: "gray.300"
												}}
												_focus={{ boxShadow: "none", outline: "none" }}
											>
												Dashboard
											</Link>
											<Link
												as={NextLink}
												href="/about"
												p={2}
												rounded="md"
												fontWeight="bold"
												color={pathname === "/about" ? "red.500" : "black"}
												_hover={{
													textDecor: "none",
													boxShadow: "md",
													bg: 'gray.300'
												}}
												_focus={{ boxShadow: "none", outline: "none" }}
											>
												About
											</Link>
												<Accordion.Root multiple>
													{menus.map((item) => (
														<Accordion.Item key={item.value} value={item.value}>
															
															<Accordion.ItemTrigger p={2}>
																<Span flex="1">{item.title}</Span>
																<Accordion.ItemIndicator 
																	rotate="-90deg"
																	transition="transform 0.2s ease-in-out" 
																	_open={{ rotate: "0deg" }} 
																/>

															</Accordion.ItemTrigger>

															<Accordion.ItemContent>
																<Accordion.ItemBody>
																	<Stack>

																		{item.links.map((link) => (
																			<Link
																				key={link.href}
																				as={NextLink}
																				href={link.href}
																				p={2}
																				rounded="md"
																				fontWeight="medium"

																				color={pathname === link.href ? "red.500" : "black"}

																				_hover={{
																					textDecor: "none",
																					boxShadow: "md",
																					bg: "gray.200"
																				}}

																				_focus={{ boxShadow: "none", outline: "none" }}
																			>
																				{link.name}
																			</Link>
																		))}

																	</Stack>
																</Accordion.ItemBody>
															</Accordion.ItemContent>
														</Accordion.Item>
													))}
												</Accordion.Root>
												<Accordion.Root multiple>
													{settings.map((item) => (
														<Accordion.Item key={item.value} value={item.value}>
															
															<Accordion.ItemTrigger p={2}>
																<Span flex="1">{item.title}</Span>
																	<Accordion.ItemIndicator 
																		rotate="-90deg"
																		transition="transform 0.2s ease-in-out" 
																		_open={{ rotate: "0deg" }} 
																	/>

															</Accordion.ItemTrigger>

															<Accordion.ItemContent>
																<Accordion.ItemBody>
																	<Stack>

																		{item.links.map((link) => (
																			<Link
																				key={link.href}
																				as={NextLink}
																				href={link.href}
																				p={2}
																				rounded="md"
																				fontWeight="medium"

																				color={pathname === link.href ? "red.500" : "black"}

																				_hover={{
																					textDecor: "none",
																					boxShadow: "md",
																					bg: "gray.200"
																				}}

																				_focus={{ boxShadow: "none", outline: "none" }}
																			>
																				{link.name}
																			</Link>
																		))}

																	</Stack>
																</Accordion.ItemBody>
															</Accordion.ItemContent>
														</Accordion.Item>
													))}
												</Accordion.Root>
										
									</Stack>
								<Stack px='2' gap='0' flex='1'></Stack>
								<Button rounded='20px' w='full' onClick={() => handleLogout()}>Logout</Button>

							</Box>

							

								<Box  w="full" px={4} py={10}>
							<Box mb="4">
								<Breadcrumb.Root>
									<Breadcrumb.List>
										
										<Breadcrumb.Item>
											<Breadcrumb.Link 	as={NextLink} href="/">Home</Breadcrumb.Link>
										</Breadcrumb.Item>

										{activeCategory && (
											<>
												<Breadcrumb.Separator>
													<LiaSlashSolid />
												</Breadcrumb.Separator>
												<Breadcrumb.Item>
													{/* Title ng Category (e.g., Settings) */}
													<Breadcrumb.Link href="#">{activeCategory.title}</Breadcrumb.Link>
												</Breadcrumb.Item>
											</>
										)}

										{activeLink && (
											<>
												<Breadcrumb.Separator>
													<LiaSlashSolid />
												</Breadcrumb.Separator>
												<Breadcrumb.Item>
													{/* Ang mismong Page Name (e.g., Mikrotik) */}
													<Breadcrumb.CurrentLink>
														{activeLink.name}
													</Breadcrumb.CurrentLink>
												</Breadcrumb.Item>
											</>
										)}

									</Breadcrumb.List>
								</Breadcrumb.Root>
							</Box>
									{children}
								</Box>
							</Flex>
					</Container>	
				</Provider>
      </body>
    </html>
  )
}

const menus = [
  {
    value: "management",
    title: "Management",
    links: [
      { name: "Customers", href: "/management/customers" }, // Mas direct ang URL
    ]
  },
  {
    value: "a",
    title: "Menu",
    links: [
      { name: "Profile", href: "/menu/profile" },
      { name: "Plan", href: "/menu/plan" },
    ]
  }
]

const settings = [
  {
    value: "a",
    title: "Settings",
    links: [
      { name: "Mikrotik", href: "/mikrotik" },
    ]
  }
]