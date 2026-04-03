import { Box, VStack } from "@chakra-ui/react";

import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <VStack w={"100%"} h={"100%"} bg={"gray.100"} alignItems={"flex-start"}>
        <Navbar/>
        <Box w={"100%"}>
            {children}
        </Box>
    </VStack>
  );
};

export default Layout;