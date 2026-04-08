import { Flex, Heading, VStack, FormControl, Input, Text, Box, Button, FormLabel, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { createPost, uploadToCloudinary } from "../api/endpoints";
import { useNavigate } from "react-router-dom";
 
const CreatePostTab = () => {
    const navigate = useNavigate();
 
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
 
    const handlePost = async () => {
        try {
            if (!description.trim()) {
                alert("Please enter a description");
                return;
            }
 
            setLoading(true);
 
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }
 
            await createPost(description, imageUrl);
 
            setDescription("");
            setPreviewImage(null);
            setImageFile(null);
            alert("Post created successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Error creating post");
        } finally {
            setLoading(false);
        }
    }
 
    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value);
 
        const textarea = event.target;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    };
 
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setPreviewImage(null);
        }
    }
 
    return (
        <Flex flexDirection={"column"} w={"100%"} h={"100%"} alignItems={"center"} justifyContent={"center"} pt={"50px"} gap={5}>
            <VStack w={"400px"} h={"auto"} border={"2px solid"} bg={"white"} borderRadius={"10px"} overflow={"hidden"}>
                <Heading textAlign={"center"} borderBottom={"1px solid"} borderColor={"gray.300"} w={"100%"} mt={5} p={3}>Create a new post</Heading>
                <FormControl w={"80%"} h={"80%"} overflow={"hidden"} borderRadius={"5px"}>
                    <Heading textAlign={"center"} size={"md"} p={3}>Add Image?</Heading>
 
                    <Box>
                        {previewImage ? (
                            <label htmlFor="image-upload">
                                <Box w={"100%"} h={"100%"} bg={"gray.200"} overflow={"hidden"} borderRadius={"5px"} cursor={"pointer"}>
                                    <Input w={"100%"} h={"100%"} type="file" accept="image/*" onChange={handleImageChange} display={"none"} id="image-upload" />
                                    <img src={previewImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </Box>
                            </label>
                        ) : (
                            <label htmlFor="image-upload">
                                <Box w={"100%"} h={"100%"} bg={"none"} size={"200px"} overflow={"hidden"} borderRadius={"5px"} display={"flex"} alignItems={"center"} justifyContent={"center"} cursor={"pointer"}>
                                    <RiImageAddFill size={"100%"} />
                                    <Input w={"100%"} h={"100%"} type="file" accept="image/*" onChange={handleImageChange} display={"none"} id="image-upload" />
                                </Box>
                            </label>
                        )}
                    </Box>
                </FormControl>
 
                <Flex w={"100%"} h={"auto"} justifyContent={"flex-start"} borderColor={"gray.300"} p={3}>
                    <FormControl fontSize={"lg"} fontWeight={"500"} textAlign={"center"} overflow={"hidden"} display={"flex"} alignItems={"center"} justifyContent={"center"} border={"transparent"} borderRadius={"5px"} _hover={{ border: "transparent" }} flexDirection={"column"}>
                        <FormLabel>Add a description*</FormLabel>
                        <Textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Enter description"
                            resize="none"
                            minHeight="50px"
                            overflow="hidden"
                            fontFamily="inherit"
                        />
                    </FormControl>
                </Flex>
                <Text fontSize={10} color={"gray.500"} p={2} alignSelf={"flex-start"}>
                    * Required field
                </Text>
            </VStack>
            <Button ml={5} size={"lg"} onClick={handlePost} colorScheme={"blue"} isLoading={loading} loadingText="Posting...">
                Post
            </Button>
        </Flex>
    )
}
 
export default CreatePostTab;