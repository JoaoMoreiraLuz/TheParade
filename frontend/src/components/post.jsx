import { Image, Text, VStack, Box, HStack, Flex } from "@chakra-ui/react"
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

import { SERVER_URL } from "../constants/constants"

import { toggleLike } from "../api/endpoints";

export const Post = ({ id, username, description, liked, image, likes_count, format_created_at }) => {

    const [clientLiked, setClientLiked] = useState(liked);
    const [clientLikesCount, setClientLikesCount] = useState(likes_count);

    const handleLikeToggle = async () => {
        const data = await toggleLike(id);
        if (data.liked) {
            setClientLiked(true);
            setClientLikesCount(clientLikesCount + 1);
        } else {
            setClientLiked(false);
            setClientLikesCount(clientLikesCount - 1);
        }
    }



    return (

        <VStack w={"400px"} h={"500px"} border={"2px solid"} borderColor={"gray.300"} borderRadius={"10px"} overflow={"hidden"} gap={0}>
            <HStack bg={"white"} w={"100%"} p={3} gap={2} alignItems={"start"} justifyContent={"space-between"} borderBottom={"1px solid"} borderColor={"gray.300"}>
                <Text fontWeight={"bold"} fontSize={"sm"}>{"@" + username}</Text>
                <Text fontSize={"sm"} color={"gray.400"}>{format_created_at}</Text>
            </HStack>

            {image ? (
                <>
                    <Box w={"100%"} flex={1} bg={"gray.200"} overflow={"hidden"} borderRadius={"0px"}>
                        <Image w={"100%"} h={"100%"} objectFit={"cover"} src={`${SERVER_URL}${image}`} alt="Post Image" />
                    </Box>
                    <Flex w={"100%"} h={"auto"} maxH={"100px"} overflow={"auto"} justifyContent={"flex-start"} borderTop={"1px solid"} borderColor={"gray.300"} p={3}>
                        <Text fontSize={"sm"}>{description}</Text>
                    </Flex>
                </>
            ) : (
                <Flex w={"100%"} h={"auto"} flex={1} alignItems={"center"} justifyContent={"center"} borderBottom={"1px solid"} borderColor={"gray.300"} p={3}>
                    <Box w={"100%"} h={"100%"} bg={"blue.500"}  flex={1} overflow={"hidden"} borderRadius={"5px"} display={"flex"} alignItems={"center"} justifyContent={"center"} p={4}>
                        <Text fontSize={"lg"} fontWeight={"500"} textAlign={"center"}>
                            {description}
                        </Text>
                    </Box>
                </Flex>
            )}

            <Flex w={"100%"} alignItems={"start"} p={2} justifyContent={"flex-start"} gap={3} bg={"white"}>
                <HStack>
                    <Box color={clientLiked ? "red.500" : "gray.400"} fontSize={"md"} cursor={"pointer"} _hover={{ fontSize: "xl", color: clientLiked ? "gray.500" : "red.600", transition: "0.2s" }} onClick={handleLikeToggle}>
                        <FaHeart />
                    </Box>
                    <Text fontSize={"sm"}>{clientLikesCount} likes</Text>
                </HStack>
            </Flex>
        </VStack>
    )

}