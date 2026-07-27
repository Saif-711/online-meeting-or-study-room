import axios from "axios";
const API_URL = "http://localhost:8088/api/rooms";

export const createRoom = async (roomData,token)=>{
    const response = await axios.post(`${API_URL}/create`,roomData,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
