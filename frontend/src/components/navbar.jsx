import { Flex, HStack, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

import { RiUserFill } from "react-icons/ri";


const Navbar = () => {
    const navigate = useNavigate()

    const handleNavigate = (route) => {
        navigate(`/${route}`)
    }

    return (
        <Flex w={"100%"} h={"90px"} bg={"#333"} justifyContent={"center"} alignContent={"center"}>
            <HStack w={"90%"} justifyContent={"space-between"} color={"white"}>
                <Text color="white" fontSize="2xl" fontWeight="bold">The Parade</Text>
                <HStack>
                    <Text color="white" fontSize="lg" onClick={() => handleNavigate("/JoaoG")}>
                        <RiUserFill size={"20px"}/>
                    </Text>
                </HStack>
            </HStack>
        </Flex>
    )
}   

export default Navbar