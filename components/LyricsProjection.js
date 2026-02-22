import { useEffect, useState, useRef } from 'react';
import { Box, Text, VStack, IconButton, useToast } from '@chakra-ui/react';
import { FaTimes, FaExpand } from 'react-icons/fa'; // Switch to react-icons which is installed
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient'
import * as reactSpring from '@react-spring/three'
import * as drei from '@react-three/drei'
import * as fiber from '@react-three/fiber'

export default function LyricsProjection({ lyrics, song, onClose }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const toast = useToast();
    const lineRefs = useRef([]);

    // Initialize refs array
    useEffect(() => {
        lineRefs.current = lineRefs.current.slice(0, lyrics.length);
    }, [lyrics]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                setActiveIndex((prev) => Math.min(prev + 1, lyrics.length - 1));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                setActiveIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lyrics, onClose]);

    // Scroll active line into center
    useEffect(() => {
        const activeLine = lineRefs.current[activeIndex];
        if (activeLine) {
            activeLine.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeIndex]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                toast({
                    title: "Error enabling fullscreen",
                    description: err.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="#000000"
            zIndex="9999"
            color="white"
            overflow="hidden"
        >
            {/* Background Gradient */}
            <Box position="absolute" top={0} left={0} w="100%" h="100%" zIndex={-1}>
                <ShaderGradientCanvas
                    importedFiber={{ ...fiber, ...drei, ...reactSpring }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        opacity: 0.5,
                    }}
                >
                    <ShaderGradient
                        animate="on"
                        axesHelper="off"
                        brightness={0.8}
                        cAzimuthAngle={180}
                        cDistance={3.5}
                        cPolarAngle={80}
                        cameraZoom={9.1}
                        color1="#606080"
                        color2="#8d7dca"
                        color3="#212121"
                        destination="onCanvas"
                        embedMode="off"
                        envPreset="city"
                        format="gif"
                        fov={40}
                        frameRate={10}
                        gizmoHelper="hide"
                        grain="on"
                        lightType="3d"
                        pixelDensity={1}
                        positionX={0}
                        positionY={0}
                        positionZ={0}
                        range="disabled"
                        rangeEnd={40}
                        rangeStart={0}
                        reflection={0.1}
                        rotationX={50}
                        rotationY={0}
                        rotationZ={-60}
                        shader="defaults"
                        type="waterPlane"
                        uAmplitude={0}
                        uDensity={1.1}
                        uFrequency={0}
                        uSpeed={0.3}
                        uStrength={0.7}
                        uTime={8}
                        wireframe={false}
                    />
                </ShaderGradientCanvas>
            </Box>

            {/* Controls Overlay */}
            <Box position="fixed" top="4" right="4" zIndex="10000" opacity="0.3" _hover={{ opacity: 1 }} transition="opacity 0.2s">
                <IconButton
                    aria-label="Toggle Fullscreen"
                    icon={<FaExpand />}
                    onClick={toggleFullscreen}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    mr={2}
                />
                <IconButton
                    aria-label="Close"
                    icon={<FaTimes />}
                    onClick={onClose}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                />
            </Box>

            {/* Lyrics Container - Scrollable List */}
            <Box
                ref={containerRef}
                height="100vh"
                overflowY="auto"
                width="100%"
                className="no-scrollbar" // Add css to hide scrollbar if needed, or use sx
                sx={{
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    'msOverflowStyle': 'none',
                    'scrollbarWidth': 'none',
                }}
            >
                <VStack
                    spacing={8}
                    align="start"
                    justify="start"
                    width="100%"
                    paddingTop="50vh"
                    paddingBottom="50vh"
                    paddingLeft="6%" // Requested padding
                    paddingRight="6%"
                >
                    {lyrics.map((line, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <Text
                                key={index}
                                ref={el => lineRefs.current[index] = el}
                                fontSize="6rem"
                                lineHeight="1.1"
                                fontWeight="bold"
                                fontFamily="'Google Sans', sans-serif"
                                textAlign="left"
                                width="82%"
                                transition="all 0.5s ease-in-out"
                                opacity={isActive ? 1 : 0.3} // Dim inactive lines
                                transform={isActive ? "scale(1)" : "scale(0.95)"}
                                filter={isActive ? "none" : "blur(4px)"}
                                cursor="pointer"
                                onClick={() => setActiveIndex(index)}
                                _hover={{
                                    opacity: isActive ? 1 : 0.6
                                }}
                            >
                                {line}
                            </Text>
                        );
                    })}
                </VStack>
            </Box>
        </Box>
    );
}
