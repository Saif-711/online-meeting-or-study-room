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

export const getMyRooms = async (token)=>{
    const response = await axios.get(`${API_URL}/mine`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const joinRoom = async (roomCode, password, token)=>{
    //post has 3 parameters: url, body, headers(or config) =>/join , password, token
    const response = await axios.post(`${API_URL}/${roomCode}/join`, 
        
        { password },{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const getRoomDetails = async (roomCode, token)=>{
    const response = await axios.get(`${API_URL}/${roomCode}`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const leaveRoom = async(token,roomCode) =>{
    const response = await axios.post(`${API_URL}/${roomCode}/leave`,{},{
        headers:{
            Authorization: `Bearer ${token}`
        }
 });
    return response.data;
}