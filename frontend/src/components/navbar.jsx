import { Flex, HStack, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

import { RiUserFill } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";

import TheParade from "../media/TheParade.png";

//icon color scheme
//c21f1f
//5a36f0



const Navbar = () => {
    const navigate = useNavigate()

    const handleNavigate = (route) => {
        navigate(`/${route}`)
    }

    return (
        <Flex w={"100%"} h={"80px"} bg={"#333"} justifyContent={"center"} alignContent={"center"} alignItems={"center"} p={4}>
            <HStack w={"90%"} h={"80px"} justifyContent={"space-between"} color={"white"}>
                <Text color="white" fontWeight="bold" onClick={() => handleNavigate("/")} cursor={"pointer"} _hover={{ color: "red.300", transition: "0.2s" }} >
                    <img src={TheParade} alt="The Parade Logo" height={"200px"} width={"200px"} />
                </Text>
                <HStack gap={5}>
                    <Text color="white" fontSize="lg" onClick={() => handleNavigate("/Login")} cursor={"pointer"} _hover={{ color: "gray.400", transition: "0.2s" }}>
                        <RiUserFill size={"20px"}/> 
                    </Text>
                    <Text color="white" fontSize="lg" onClick={() => handleNavigate("/create/post")} cursor={"pointer"} _hover={{ color: "gray.400", transition: "0.2s" }}> 
                        <IoMdAddCircleOutline size={"22px"}/>
                    </Text>
                    
                </HStack>
            </HStack>
        </Flex>
    )
}   

export default Navbar