import { Button, Flex, VStack, Heading, FormControl, FormLabel, Input, Textarea, Box } from '@chakra-ui/react';
import { useState, useEffect } from "react";
import { SERVER_URL } from "../constants/constants";
import { getUserProfile, logout, updateUser } from "../api/endpoints";

import { useNavigate } from 'react-router-dom';

const ProfileEditor = () => {

    const storage = JSON.parse(localStorage.getItem('user')) || {};

    const [username, setUsername] = useState(storage.username || '');
    const [firstname, setFirstname] = useState(storage.first_name || '');
    const [lastname, setLastname] = useState(storage.last_name || '');
    const [bio, setBio] = useState(storage.bio || '');
    const [email, setEmail] = useState(storage.email || '');
    const [previewImage, setPreviewImage] = useState(
        storage.profile_image ? `${SERVER_URL}/api${storage.profile_image}` : ''
    );
    const [imageFile, setImageFile] = useState(null);

    const nav = useNavigate()

          const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.ml_default);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.di4g4s4zh}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    setPreviewImage(data.secure_url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (image) {
      setLoading(true);
      await uploadImage(image);
      setLoading(false);
    }
  };

    const handleLogout = async () => {
        try {
            await logout()
            nav('/login')
        } catch {
            alert ("error logging out")
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!username) return;
                const data = await getUserProfile(username);
                const userData = data.user || data; // adapta caso o endpoint retorne user dentro de user
                setUsername(userData.username || '');
                setFirstname(userData.first_name || '');
                setLastname(userData.last_name || '');
                setBio(userData.bio || '');
                setEmail(userData.email || '');
                if (userData.profile_image) {
                    setPreviewImage(
                        userData.profile_image.startsWith("http")
                            ? userData.profile_image
                            : `${SERVER_URL}/api${userData.profile_image}`
                    );
                }
            } catch (err) {
                console.error("Erro ao buscar perfil:", err);
            }
        };

        fetchUser();
    }, [username]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
            handleSubmit()
        } else {
            setImageFile(null);
            setPreviewImage(storage.profile_image ? `${SERVER_URL}/api${storage.profile_image}` : '');
        }
    };

    const handleUpdate = async () => {
    try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("first_name", firstname);
        formData.append("last_name", lastname);
        formData.append("bio", bio);
        if (imageFile) formData.append("profile_image", imageFile);

        // Atualiza no backend e recebe o usuário atualizado
        const updatedUser = await updateUser(formData);

        // Atualiza localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Atualiza previewImage para refletir a URL final do backend
        if (updatedUser.profile_image) {
            setPreviewImage(
                updatedUser.profile_image.startsWith("http")
                    ? updatedUser.profile_image
                    : `${SERVER_URL}/api${updatedUser.profile_image}`
            );
        }

        alert('Profile successfully updated!');
        nav('/')
    } catch (err) {
        console.error("Erro ao atualizar:", err.response?.data || err);
        alert('Error updating profile.');
    }
};

    return (
        <Flex w="100%" h="100%" maxH="130vh" alignContent="center" justifyContent="center" flexDirection="column" alignItems="center" pt="30px">
            <VStack w="95%" maxW="400px" maxH="80%" p={5} borderWidth={1} borderRadius={5} boxShadow="lg" bg="#fff" gap="10px">
                <Heading>Edit Profile</Heading>

                <Box>
                    <label htmlFor="image-upload">
                        <Box
                            w="120px"
                            h="120px"
                            borderRadius="50%"
                            overflow="hidden"
                            cursor="pointer"
                            bg="gray.200"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <span>Selecionar</span>
                            )}
                        </Box>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            display="none"
                            id="image-upload"
                        />
                    </label>
                </Box>

                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        h="150px"
                        placeholder="Enter Bio"
                        resize="none"
                        minHeight="50px"
                        overflow="hidden"
                        fontFamily="inherit"
                    />
                </FormControl>

                <VStack w="100%" alignItems="center">
                    <Button onClick={handleUpdate} w="75%" size="lg" colorScheme="blue">
                        Save changes
                    </Button>
                </VStack>
            </VStack>
                    <Button onClick={handleLogout} colorScheme="red" mt={5} mb={5}>
                        Logout
                    </Button>
        </Flex>
    );
};

export default ProfileEditor;