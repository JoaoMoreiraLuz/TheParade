import {
    Image, Text, VStack, Box, HStack, Flex,
    Modal, ModalOverlay, ModalContent, ModalBody,
    useDisclosure, Avatar, Input, IconButton, Spinner, Divider
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { toggleLike, getComments, createComment } from "../api/endpoints";

export const Post = ({ id, username, description, liked, image, likes_count, format_created_at }) => {

    const [clientLiked, setClientLiked] = useState(liked);
    const [clientLikesCount, setClientLikesCount] = useState(likes_count);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const handleLikeToggle = async (e) => {
        e.stopPropagation();
        const data = await toggleLike(id);
        if (data.liked) {
            setClientLiked(true);
            setClientLikesCount(prev => prev + 1);
        } else {
            setClientLiked(false);
            setClientLikesCount(prev => prev - 1);
        }
    };

    const handleUsernameClick = (e) => {
        e.stopPropagation();
        navigate(`/${username}`);
    };

    return (
        <>
            <VStack
                w={"400px"} h={"500px"}
                border={"2px solid"} borderColor={"gray.300"}
                borderRadius={"10px"} overflow={"hidden"} gap={0}
                cursor={"pointer"} _hover={{ borderColor: "blue.300", boxShadow: "md" }}
                transition={"all 0.2s"}
                onClick={onOpen}
            >
                <HStack bg={"white"} w={"100%"} p={3} gap={2} alignItems={"start"} justifyContent={"space-between"} borderBottom={"1px solid"} borderColor={"gray.300"}>
                    <Text
                        fontWeight={"bold"} fontSize={"sm"}
                        _hover={{ color: "blue.500", textDecoration: "underline" }}
                        onClick={handleUsernameClick}
                        cursor={"pointer"}
                    >
                        {"@" + username}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.400"}>{format_created_at}</Text>
                </HStack>

                {image ? (
                    <>
                        <Box w={"100%"} flex={1} bg={"gray.200"} overflow={"hidden"}>
                            <Image w={"100%"} h={"100%"} objectFit={"cover"} src={image} alt="Post Image" />
                        </Box>
                        <Flex w={"100%"} h={"auto"} maxH={"100px"} overflow={"auto"} justifyContent={"flex-start"} borderTop={"1px solid"} borderColor={"gray.300"} p={3}>
                            <Text fontSize={"sm"}>{description}</Text>
                        </Flex>
                    </>
                ) : (
                    <Flex w={"100%"} flex={1} alignItems={"center"} justifyContent={"center"} borderBottom={"1px solid"} borderColor={"gray.300"} p={3}>
                        <Box w={"100%"} h={"100%"} bg={"blue.500"} flex={1} overflow={"hidden"} borderRadius={"5px"} display={"flex"} alignItems={"center"} justifyContent={"center"} p={4}>
                            <Text fontSize={"lg"} fontWeight={"500"} textAlign={"center"}>{description}</Text>
                        </Box>
                    </Flex>
                )}

                <Flex w={"100%"} alignItems={"center"} p={2} justifyContent={"flex-start"} gap={3} bg={"white"}>
                    <HStack>
                        <Box
                            color={clientLiked ? "red.500" : "gray.400"} fontSize={"md"}
                            cursor={"pointer"}
                            _hover={{ color: clientLiked ? "gray.500" : "red.600" }}
                            onClick={handleLikeToggle}
                        >
                            <FaHeart />
                        </Box>
                        <Text fontSize={"sm"}>{clientLikesCount} likes</Text>
                    </HStack>
                    <HStack>
                        <Box color={"gray.400"} fontSize={"md"}>
                            <FaRegComment />
                        </Box>
                        <Text fontSize={"sm"} color={"gray.500"}>comentários</Text>
                    </HStack>
                </Flex>
            </VStack>

            <PostModal
                isOpen={isOpen}
                onClose={onClose}
                id={id}
                username={username}
                description={description}
                image={image}
                format_created_at={format_created_at}
                clientLiked={clientLiked}
                clientLikesCount={clientLikesCount}
                onLikeToggle={handleLikeToggle}
                onUsernameClick={handleUsernameClick}
            />
        </>
    );
};

const PostModal = ({ isOpen, onClose, id, username, description, image, format_created_at, clientLiked, clientLikesCount, onLikeToggle, onUsernameClick }) => {

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);
    const commentsEndRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const fetchComments = async () => {
            setLoadingComments(true);
            try {
                const data = await getComments(id);
                setComments(data);
            } catch (err) {
                console.error("Erro ao buscar comentários:", err);
            } finally {
                setLoadingComments(false);
            }
        };
        fetchComments();
    }, [isOpen, id]);

    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]);

    const handleSendComment = async () => {
        if (!newComment.trim()) return;
        setSending(true);
        try {
            const comment = await createComment(id, newComment.trim());
            setComments(prev => [...prev, comment]);
            setNewComment("");
        } catch (err) {
            console.error("Erro ao enviar comentário:", err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendComment();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} isCentered>
            <ModalOverlay bg={"blackAlpha.700"} backdropFilter={"blur(4px)"} />
            <ModalContent borderRadius={"12px"} overflow={"hidden"} maxH={"90vh"}>
                <ModalBody p={0}>
                    <Flex h={"80vh"} flexDirection={{ base: "column", md: "row" }}>

                        <Box
                            flex={1} bg={"black"} display={"flex"}
                            alignItems={"center"} justifyContent={"center"}
                            minW={{ md: "55%" }}
                        >
                            {image ? (
                                <Image src={image} w={"100%"} h={"100%"} objectFit={"contain"} />
                            ) : (
                                <Box bg={"blue.500"} w={"100%"} h={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"} p={8}>
                                    <Text fontSize={"2xl"} fontWeight={"500"} textAlign={"center"} color={"white"}>{description}</Text>
                                </Box>
                            )}
                        </Box>

                        <Flex flexDirection={"column"} w={{ base: "100%", md: "380px" }} bg={"white"}>

                            <HStack p={4} borderBottom={"1px solid"} borderColor={"gray.200"} justifyContent={"space-between"}>
                                <Text
                                    fontWeight={"bold"} fontSize={"sm"}
                                    cursor={"pointer"}
                                    _hover={{ color: "blue.500", textDecoration: "underline" }}
                                    onClick={(e) => { onClose(); onUsernameClick(e); }}
                                >
                                    {"@" + username}
                                </Text>
                                <Text fontSize={"xs"} color={"gray.400"}>{format_created_at}</Text>
                            </HStack>

                            {image && description && (
                                <Box px={4} py={3} borderBottom={"1px solid"} borderColor={"gray.100"}>
                                    <Text fontSize={"sm"}>{description}</Text>
                                </Box>
                            )}

                            <Flex flex={1} flexDirection={"column"} overflowY={"auto"} p={4} gap={4}>
                                {loadingComments ? (
                                    <Flex justifyContent={"center"} pt={4}>
                                        <Spinner size={"md"} color={"blue.400"} />
                                    </Flex>
                                ) : comments.length === 0 ? (
                                    <Text fontSize={"sm"} color={"gray.400"} textAlign={"center"} pt={4}>
                                        Nenhum comentário ainda. Seja o primeiro!
                                    </Text>
                                ) : (
                                    comments.map(comment => (
                                        <CommentItem key={comment.id} comment={comment} />
                                    ))
                                )}
                                <div ref={commentsEndRef} />
                            </Flex>

                            <Divider />

                            <HStack px={4} py={2}>
                                <Box
                                    color={clientLiked ? "red.500" : "gray.400"}
                                    fontSize={"lg"} cursor={"pointer"}
                                    _hover={{ color: clientLiked ? "gray.500" : "red.600" }}
                                    onClick={onLikeToggle}
                                >
                                    <FaHeart />
                                </Box>
                                <Text fontSize={"sm"} fontWeight={"semibold"}>{clientLikesCount} likes</Text>
                            </HStack>

                            <Divider />

                            <HStack p={3} gap={2}>
                                <Input
                                    placeholder={"Adicione um comentário..."}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    variant={"unstyled"}
                                    fontSize={"sm"}
                                    flex={1}
                                    px={2}
                                />
                                <IconButton
                                    icon={sending ? <Spinner size={"xs"} /> : <IoSend />}
                                    size={"sm"}
                                    colorScheme={"blue"}
                                    variant={"ghost"}
                                    isDisabled={!newComment.trim() || sending}
                                    onClick={handleSendComment}
                                    aria-label="Enviar comentário"
                                />
                            </HStack>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const CommentItem = ({ comment }) => {
    return (
        <HStack alignItems={"flex-start"} gap={3}>
            <Avatar
                size={"sm"}
                name={comment.username}
                src={comment.profile_image || undefined}
                flexShrink={0}
            />
            <VStack alignItems={"flex-start"} gap={0}>
                <HStack gap={2} alignItems={"baseline"}>
                    <Text fontWeight={"bold"} fontSize={"xs"}>{comment.username}</Text>
                    <Text fontSize={"xs"} color={"gray.400"}>{comment.format_created_at}</Text>
                </HStack>
                <Text fontSize={"sm"}>{comment.text}</Text>
            </VStack>
        </HStack>
    );
};