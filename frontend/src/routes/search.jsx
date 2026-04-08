import { Flex, Heading, HStack, VStack, Button, Input, Text, Box, Image } from "@chakra-ui/react";''
import { useEffect, useState } from "react";
import { SERVER_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";

import { searchUsersEndpoint } from "../api/endpoints";

const Search = () => {

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

        const handleSearch = async () => {
    try {
        const data = await searchUsersEndpoint(search);
        console.log("SEARCH DATA:", data);
        setUsers(data.results);
    } catch (err) {
        console.error("Erro ao buscar usuários:", err);
    }
}


    return (
        <Flex w={"100%"} justifyContent={"center"} pt={"50px"} bg={"white"}>
            <VStack w={"95%"} maxW={"500px"} alignItems={"start"} gap={"20px"}>
                <Heading>Search Users</Heading>

                <HStack w={"100%"} gap={"0"}>
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} bg={"whitesmoke"} m={3} />
                    <Button colorScheme="blue" onClick={handleSearch}>
                        Search
                    </Button>
                </HStack>
                <VStack w={"100%"}>
                    {Array.isArray(users) && users.map((user) => (
                        <UserProfile 
                            key={user.username}
                            username={user.username}
                            profile_image={user.profile_image}
                            first_name={user.first_name}
                            last_name={user.last_name}
                        />
                    ))}
                </VStack>
            </VStack>
        </Flex>
    )

}

const UserProfile = ({ username, profile_image, first_name, last_name }) => {

    const nav = useNavigate()
    
    const handleNav = () => {
        nav(`/${username}`)
    }

    return (
        <Flex w={"100%"} h={"100px"} border={"1px solid"} borderColor={"gray.300"} borderRadius={"8px"} bg={"white"} justifyContent={"center"} _hover={{ bg: "gray.200", transition: "0.2s" }}>
            <HStack onClick={handleNav} w={"90%"} gap={3} cursor={"pointer"}>

                <Box boxSize={'70px'} borderRadius={"full"} overflow={"hidden"} bg={"white"} border={"1px solid"}>
                    <Image src={`${profile_image}`} alt={`${first_name} ${last_name}`} boxSize={"100%"} objectFit={"cover"} />
                </Box>

                <VStack alignItems={"start"} gap={3}> 
                    <Text fontWeight={"medium"} >{first_name} {last_name}</Text>
                    <Text color={"gray.600"} fontSize={"15px"}>@{username}</Text>
                </VStack>

            </HStack>
        </Flex>
    )
}

export default Search;