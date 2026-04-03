import axios from "axios";
import { SERVER_URL } from "../constants/constants";

const API_BASE_URL = SERVER_URL;

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('refresh_token='));
                
                if (!refreshToken) {
                    // Nenhum refresh token disponível
                    return Promise.reject(error);
                }

                await API.post("/token/refresh/");
                return API(originalRequest);
            } catch (refreshError) {
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export const getUserProfile = async (username) => {
    try {
        const response = await API.get(`/user/${username}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const login = async (username, password) => {
    try {
        const response = await API.post("/token/", { username, password });
        return response.data;
    }
    catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

export const register = async (username, email, password, first_name, last_name) => {
    try {
        const response = await API.post("/register/", { 
            username, 
            email, 
            password, 
            first_name, 
            last_name 
        });
        return response.data;
    }
    catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

export const getAuthenticatedUser = async () => {
    const response = await API.get("/isauthenticated/");
    return response.data;
}

export const toggleFollow = async (username) => {
    const response = await API.post("/toggle-follow/", { username: username });
    return response.data;
}

export const getUserPosts = async (username) => {
    const response = await API.get(`/posts/${username}/`);
    return response.data;
}

export const toggleLike = async (post_id) => {
    const response = await API.post("/toggle-like/", { post_id: post_id });
    return response.data;
}

export const createPost = async (description, imageFile) => {
    const formData = new FormData();
    formData.append('description', description);
    if (imageFile) {
        formData.append('image', imageFile);
    }
    const response = await API.post("/create-post/", formData);
    return response.data;
}

export const getFeedPosts = async (num) => {
    const response = await API.get(`/feed/?page=${num}`);
    return response.data;
}