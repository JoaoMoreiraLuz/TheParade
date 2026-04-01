import { Button, Flex, FormControl, FormLabel, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { login, register } from "../api/endpoints";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password == confirmPassword) {

            try {
                await register(username, email, password, firstName, lastName);
                alert("Registration successful, you can now login with your credentials.");
                navigate("/login");

            } catch (error) {
                console.error("Error during registration:", error);
                alert("Registration failed, please try again.");
            }

    } else {
        alert("Passwords do not match, please try again.");
        }
    }

    const handleNav = () => {
        navigate("/login");
    }


    return (
        <Flex w={"100%"} h={"100vh"} alignContent={"center"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
            <VStack w={"95%"} maxW={"400px"} maxH={"80%"}  p={5} borderWidth={1} borderRadius={5} boxShadow={"lg"} bg={"#fff"} gap={2}>
            <Heading>Register</Heading>
                <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input onChange={(e) => setUsername(e.target.value)} type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input onChange={(e) => setEmail(e.target.value)} type="email" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <Input onChange={(e) => setFirstName(e.target.value)} type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <Input onChange={(e) => setLastName(e.target.value)} type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input onChange={(e) => setPassword(e.target.value)} type="password" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <Input onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
                </FormControl>
                <VStack w={"100%"} alignItems={"center"}>
                <Button type="submit" w={"75%"} size="lg" colorScheme="blue" onClick={handleRegister}>
                    Register
                </Button>
                <Button variant={"link"} onClick={handleNav}>
                    Already have an account? Login here.
                </Button>
                </VStack>
            </VStack>
            <Text>Obs: Use a fake username and password for now, the database security is not implemented yet</Text>
        </Flex>
    );
}

export default Register;