import { Button, Flex, FormControl, FormLabel, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { authLogin } = useAuth();

    const handleLogin = async () => {
        authLogin(username, password);
    }

    const handleNav = () => {
        navigate("/register");
    }




    return (
        <Flex w={"100%"} h={"100vh"} alignContent={"center"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
            <VStack w={"95%"} maxW={"400px"} maxH={"80%"}  p={5} borderWidth={1} borderRadius={5} boxShadow={"lg"} bg={"#fff"} gap={2}>
            <Heading>Login</Heading>
                <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input onChange={(e) => setUsername(e.target.value)} type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input onChange={(e) => setPassword(e.target.value)} type="password" />
                </FormControl>
                <VStack w={"100%"} alignItems={"center"}>
                <Button type="submit" w={"75%"} size="lg" colorScheme="blue" onClick={handleLogin}>
                    Login
                </Button>
                <Button variant={"link"} onClick={handleNav}>
                    Don't have an account? Register here.
                </Button>
                </VStack>
            </VStack>
            <Text>Obs: Use a fake username and password for now, the database security is not implemented yet</Text>
        </Flex>
    );
}

export default Login;