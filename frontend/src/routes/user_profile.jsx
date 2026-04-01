import { Box, Button, Flex, Heading, HStack, Image, Spacer, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUserProfile, toggleFollow } from "../api/endpoints";
import { useAuth } from "../contexts/useAuth";
import { SERVER_URL } from "../constants/constants";

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
    <Flex w={"100%"} paddingTop={"40px"} justifyContent={"flex-start"} alignItems={"center"} paddingLeft={"40px"}>
      <VStack w={"75%"}>
        <Box w={"100%"} mt={"40px"}>
          <UserDetails username={username} />
        </Box>
      </VStack>
    </Flex>
  );
}

const UserDetails = ({ username }) => {

  const { user: loggedInUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isOurProfile, setIsOurProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = async () => {
    const data = await toggleFollow(username);
    if (data.isFollowing) {
      setFollowers(followers + 1);
      setIsFollowing(true);
    } else {
      setFollowers(followers - 1);
      setIsFollowing(false);
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(username);
        setBio(data.bio);
        setProfileImage(data.profile_image);
        setFollowers(data.followersCount);
        setFollowing(data.followingCount);

        setIsOurProfile(data.LoggedAs);
        setIsFollowing(data.Following);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  return (
    <VStack w={"100%"} alignItems={"start"} gap={"40px"}>
      <Heading>@{username}</Heading>
    <HStack gap={"20px"} alignItems={"center"}>
        <Box boxSize={"150px"} border={"2px solid"} borderColor={"gray.300"} borderRadius={"full"} overflow={"hidden"}>
            <Image boxSize={"100%"} objectFit={"cover"} src={ loading ? null : `${SERVER_URL}${profileImage}`} />
        </Box>
        <VStack gap={"20px"}>
          <HStack gap={"20px"} fontSize={"18px"}>
            <VStack>
              <Text>Followers</Text>
              <Text>{ loading ? "-" : followers}</Text>
            </VStack>
            <VStack>
              <Text>Following</Text>
              <Text>{ loading ? "-" : following}</Text>
            </VStack>
          </HStack>
          {
            loading ? 
              <Spacer />
            :
            isOurProfile ? 
              <Button w={"100%"} bg={"#333"} _hover={{ bg: "blue.600" }} textColor={"#fcfcfc"}>Edit profile</Button>
            :
              <Button onClick={handleFollowToggle} w={"100%"} bg={isFollowing ? "gray.500" : "blue.500"} _hover={{ bg: isFollowing ? "gray.600" : "blue.600" }}>{isFollowing ? "Unfollow" : "Follow"}</Button>
          }
        </VStack>
      </HStack> 
      <Text fontSize={"18px"}>{ loading ? "..." : bio}</Text>
    </VStack>
  );
}

export default UserProfile;