import { Box, Button, Flex, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUserProfile, toggleFollow, getUserPosts } from "../api/endpoints";
import { useAuth } from "../contexts/useAuth";
import { Post } from "../components/post";
import { useNavigate } from 'react-router-dom';

function UserProfile() {

  const getUsernameFromURL = () => {
    const url = window.location.pathname.split("/");
    return url[url.length - 1];
  }

  const [username, setUsername] = useState(getUsernameFromURL());

  useEffect(() => {
    setUsername(getUsernameFromURL());
  }, []);

  return (
    <Flex w={"100%"} h={"100%"} bg={"whitesmoke"} paddingTop={"40px"} justifyContent={"flex-start"} alignItems={"center"} paddingLeft={"40px"}>
      <VStack w={"100%"}>
        <Box w={"100%"} mt={"40px"}>
          <UserDetails username={username} />
        </Box>
        <Box w={"100%"} mt={"30px"}>
          <UserPosts username={username} />
        </Box>
      </VStack>
    </Flex>
  );
}

const UserDetails = ({ username }) => {
  const { user: loggedInUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isOurProfile, setIsOurProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const nav = useNavigate();

  const handleEditButton = () => {
    nav('/profileEditor');
  }

  const handleFollowToggle = async () => {
    try {
      const data = await toggleFollow(username);
      setIsFollowing(data.isFollowing);

      setUserData(prev => ({
        ...prev,
        followersCount: data.isFollowing
          ? prev.followersCount + 1
          : prev.followersCount - 1
      }));
    } catch (err) {
      console.error("Erro ao seguir/desseguir usuário:", err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfile(username);

        setUserData(res.user);
        setIsFollowing(res.Following);

        // Corrigido: usa res.user diretamente para evitar comparar com userData (ainda null)
        if (loggedInUser && res.user && loggedInUser.username === res.user.username) {
          setIsOurProfile(true);
        } else {
          setIsOurProfile(false);
        }

      } catch (err) {
        console.error("Erro ao buscar perfil do usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, loggedInUser]);

  if (loading) return <Text>Carregando perfil...</Text>;
  if (!userData) return <Text>Usuário não encontrado</Text>;

  return (
    <VStack w="100%" alignItems="start" gap="40px">
      <Heading>@{userData.username}</Heading>

      <HStack gap="20px" alignItems="center">
        <Box
          boxSize="150px"
          border="2px solid"
          borderColor="gray.300"
          borderRadius="full"
          overflow="hidden"
        >
          {/* Com Cloudinary, a URL já vem completa */}
          <Image
            boxSize="100%"
            objectFit="cover"
            src={userData.profile_image}
          />
        </Box>

        <VStack gap="20px">
          <HStack gap="20px" fontSize="18px">
            <VStack>
              <Text>Followers</Text>
              <Text>{userData.followersCount}</Text>
            </VStack>
            <VStack>
              <Text>Following</Text>
              <Text>{userData.followingCount}</Text>
            </VStack>
          </HStack>

          {isOurProfile ? (
            <Button onClick={handleEditButton} w={"100%"} bg={"#333"} _hover={{ bg: "blue.600" }} textColor={"#fcfcfc"}>
              Edit profile
            </Button>
          ) : (
            <Button
              onClick={handleFollowToggle}
              w={"100%"}
              bg={isFollowing ? "gray.500" : "blue.500"}
              _hover={{ bg: isFollowing ? "gray.600" : "blue.600" }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </VStack>
      </HStack>

      <Text fontSize="18px">{userData.bio}</Text>
    </VStack>
  );
};

const UserPosts = ({ username }) => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserPosts(username);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  return (
    <Flex w={"100%"} flexWrap={"wrap"} gap={"20px"} justifyContent={"center"} pb={3}>
      {loading ?
        <Text>Loading...</Text>
        :
        posts.length === 0 ?
          <Text>This user has no posts yet.</Text>
          :
          posts.map((post) => (
            <Post key={post.id} id={post.id} username={post.username} description={post.description} liked={post.liked} image={post.image} likes_count={post.likes_count} format_created_at={post.format_created_at} />
          ))
      }
    </Flex>
  )
}

export default UserProfile;