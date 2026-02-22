import { useState, useEffect } from 'react';
import {
    Box,
    SimpleGrid,
    Input,
    Select,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Card,
    CardBody,
    Badge,
    Container,
    Spinner,
    useToast,
    Flex,
    IconButton
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const LyricsProjection = dynamic(() => import('../components/LyricsProjection'), {
    ssr: false,
});


export default function Home() {
    const [songs, setSongs] = useState([]);
    const [search, setSearch] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');
    const [loading, setLoading] = useState(true);

    // Projection State
    const [isProjecting, setIsProjecting] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentLyrics, setCurrentLyrics] = useState([]);
    const [loadingLyrics, setLoadingLyrics] = useState(false);

    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('notion_token') || sessionStorage.getItem('notion_token');
        const dbId = localStorage.getItem('notion_db_id') || sessionStorage.getItem('notion_db_id');

        if (!token || !dbId) {
            router.push('/login');
            return;
        }

        fetchSongs(token, dbId);
    }, []);

    const fetchSongs = async (token, dbId) => {
        try {
            const res = await fetch('/api/songs', {
                headers: {
                    'x-notion-token': token,
                    'x-notion-db-id': dbId
                }
            });

            if (res.status === 401) {
                toast({ status: 'error', title: 'Authentication invalid' });
                router.push('/login');
                return;
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                setSongs(data);
            } else {
                console.error("Failed to load songs", data);
            }
        } catch (error) {
            console.error(error);
            toast({ status: 'error', title: 'Failed to load songs' });
        } finally {
            setLoading(false);
        }
    };

    const startProjection = async (song) => {
        setLoadingLyrics(true);
        const token = localStorage.getItem('notion_token') || sessionStorage.getItem('notion_token');
        const dbId = localStorage.getItem('notion_db_id') || sessionStorage.getItem('notion_db_id');

        try {
            const res = await fetch(`/api/lyrics?id=${song.id}`, {
                headers: {
                    'x-notion-token': token,
                    'x-notion-db-id': dbId // Although lyrics endpoint currently only needs token, passing both is safe
                }
            });

            if (res.status === 401) {
                toast({ status: 'error', title: 'Authentication invalid' });
                router.push('/login');
                return;
            }

            const data = await res.json();

            if (res.ok) {
                setCurrentSong(song);
                setCurrentLyrics(data);
                setIsProjecting(true);
            } else {
                toast({ status: 'error', title: 'Failed to load lyrics' });
            }
        } catch (error) {
            console.error(error);
            toast({ status: 'error', title: 'Error loading lyrics' });
        } finally {
            setLoadingLyrics(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('notion_token');
        localStorage.removeItem('notion_db_id');
        sessionStorage.removeItem('notion_token');
        sessionStorage.removeItem('notion_db_id');
        router.push('/login');
    };

    const groups = ['All', ...new Set(songs.map((s) => s.group))];

    const filteredSongs = songs.filter((song) => {
        const matchesSearch = song.title.toLowerCase().includes(search.toLowerCase());
        const matchesGroup = filterGroup === 'All' || song.group === filterGroup;
        return matchesSearch && matchesGroup;
    });

    if (isProjecting && currentSong) {
        return (
            <LyricsProjection
                lyrics={currentLyrics}
                song={currentSong}
                onClose={() => setIsProjecting(false)}
            />
        );
    }

    return (
        <Container maxW="container.xl" py={10}>
            <VStack spacing={8} align="stretch">
                <Flex justify="flex-end">
                    <Button onClick={logout} size="sm" colorScheme="red" variant="ghost">
                        Logout
                    </Button>
                </Flex>

                {/* Grid */}
                {loading ? (
                    <Flex justify="center" py={20}>
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} pb={32}>
                        {filteredSongs.map((song) => (
                            <Card
                                key={song.id}
                                cursor="pointer"
                                _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                                transition="all 0.2s"
                                onClick={() => startProjection(song)}
                                bg="gray.800"
                                borderColor="gray.700"
                                borderWidth="1px"
                            >
                                <CardBody>
                                    <HStack justify="space-between" mb={2}>
                                        <Badge colorScheme="purple">{song.group}</Badge>
                                    </HStack>
                                    <Heading size="md">{song.title}</Heading>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}

                {/* Floating Bottom Menu */}
                <Box
                    position="fixed"
                    bottom="20px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="gray.900"
                    border="1px solid"
                    borderColor="gray.700"
                    borderRadius="2xl"
                    p={4}
                    boxShadow="2xl"
                    width={{ base: "90%", md: "500px" }}
                    zIndex="sticky"
                    backdropFilter="blur(10px)"
                >
                    <VStack spacing={3} align="stretch">
                        {/* Filters */}
                        <HStack overflowX="auto" pb={1} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                            {groups.map((group) => (
                                <Button
                                    key={group}
                                    size="sm"
                                    rounded="full"
                                    variant={filterGroup === group ? 'solid' : 'ghost'}
                                    colorScheme={filterGroup === group ? 'purple' : 'gray'}
                                    bg={filterGroup === group ? 'purple.600' : 'transparent'}
                                    _hover={{ bg: filterGroup === group ? 'purple.500' : 'gray.700' }}
                                    onClick={() => setFilterGroup(group)}
                                    flexShrink={0}
                                >
                                    {group}
                                </Button>
                            ))}
                        </HStack>

                        {/* Search Input */}
                        <Input
                            placeholder="Pesquisar"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="md"
                            variant="filled"
                            bg="gray.800"
                            _hover={{ bg: 'gray.700' }}
                            _focus={{ bg: 'gray.700', borderColor: 'purple.500' }}
                            rounded="xl"
                        />
                    </VStack>
                </Box>

                {/* Loading Overlay */}
                {loadingLyrics && (
                    <Box position="fixed" top="0" left="0" w="100%" h="100%" bg="blackAlpha.800" zIndex="9999" display="flex" alignItems="center" justifyContent="center">
                        <VStack>
                            <Spinner size="xl" color="white" />
                            <Text color="white" fontSize="lg">Loading lyrics...</Text>
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Container>
    );
}
