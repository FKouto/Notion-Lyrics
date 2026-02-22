import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Checkbox,
    useToast,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function Login() {
    const [token, setToken] = useState('');
    const [databaseId, setDatabaseId] = useState('');
    const [saveCredentials, setSaveCredentials] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        // Check if already logged in (optional, maybe redirect to home if found)
        const storedToken = localStorage.getItem('notion_token');
        const storedDb = localStorage.getItem('notion_db_id');
        if (storedToken && storedDb) {
            router.push('/');
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate credentials by making a test request
            const res = await fetch('/api/songs', {
                headers: {
                    'x-notion-token': token,
                    'x-notion-db-id': databaseId
                }
            });

            if (res.ok) {
                if (saveCredentials) {
                    localStorage.setItem('notion_token', token);
                    localStorage.setItem('notion_db_id', databaseId);
                } else {
                    // Use sessionStorage for temporary access if not saving
                    sessionStorage.setItem('notion_token', token);
                    sessionStorage.setItem('notion_db_id', databaseId);
                }

                toast({
                    title: 'Login successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                router.push('/');
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to connect to Notion');
            }
        } catch (error) {
            toast({
                title: 'Login failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', md: '8' }}>
            <Stack spacing="8">
                <Stack spacing="6">
                    <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                        <Heading size={{ base: 'xs', md: 'sm' }}>Login Notion</Heading>
                    </Stack>
                </Stack>
                <Box
                    py={{ base: '0', md: '8' }}
                    px={{ base: '4', md: '10' }}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={{ base: 'none', md: 'xl' }}
                    borderRadius={{ base: 'none', md: 'xl' }}
                >
                    <Stack spacing="6" as="form" onSubmit={handleLogin}>
                        <Stack spacing="5">
                            <FormControl isRequired>
                                <FormLabel htmlFor="databaseId">Database ID</FormLabel>
                                <Input
                                    id="databaseId"
                                    type="text"
                                    value={databaseId}
                                    onChange={(e) => setDatabaseId(e.target.value)}
                                    placeholder="Insira o ID do seu banco de dados"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor="token">Notion Token</FormLabel>
                                <Input
                                    id="token"
                                    type="password"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="ntn_"
                                />
                            </FormControl>
                        </Stack>
                        <Stack spacing="6">
                            <Checkbox
                                isChecked={saveCredentials}
                                onChange={(e) => setSaveCredentials(e.target.checked)}
                            >
                                Permanecer conectado
                            </Checkbox>
                            <Button
                                type="submit"
                                colorScheme="purple"
                                size="lg"
                                fontSize="md"
                                isLoading={loading}
                            >
                                Conectar
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}
