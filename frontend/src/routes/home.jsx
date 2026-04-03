import { useEffect, useState } from "react";

import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

import { getFeedPosts } from "../api/endpoints";
import { Post } from "../components/post";

const Home = () => {

    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(1);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const data = await getFeedPosts(nextPage);
            setFeed([...feed, ...data.results]);
            setNextPage(data.next ? nextPage + 1 : null);
        } catch (error) {
            console.error("Error loading feed:", error);
            alert("Error loading feed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []); // Remove [nextPage] para evitar carregamento automático de todas as páginas

    const loadMorePosts = () => {
        if (nextPage) {
            fetchFeed();
        }
    };

    return (
        <Flex w={"100%"} justifyContent={"center"} pt={"50px"}>
            <VStack gap={"50px"} pb={"50px"}>

                <Heading>Welcome to The Parade!</Heading>
                {
                    loading && feed.length === 0 ? (
                        <Text>Loading feed...</Text>
                    ) : 
                        feed.length > 0 ? 

                            <VStack>
                                
                                {feed.map(post => (
                                   <Post key={post.id} id={post.id} username={post.username} description={post.description} liked={post.liked} image={post.image} likes_count={post.likes_count} format_created_at={post.format_created_at} />
                                ))}
                            </VStack>

                         : (
                            <Text>No posts available.</Text>
                        )
                    
                }

                {
                    nextPage && !loading && (
                        <Button onClick={loadMorePosts} colorScheme="blue">
                            Load More
                        </Button>
                    ) 
                }
            </VStack>
        </Flex>
    )
}

export default Home;