import { axiosInstance } from ".";

export const allUsers = async (payload) => {
  try {
    const response = await axiosInstance.get(`/api/chats/allUsers?search=${payload}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const accessParticularChat = async (payload) => {
    try {
      const response = await axiosInstance.post(`/api/chats/accessChat`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const fetchChats = async() => {
    try {
        const response = await axiosInstance.get(`/api/chats/fetchChats`);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
}

export const createGroupChat = async(payload) => {
    try {
        const response = await axiosInstance.post(`/api/chats/createGroupChat`,payload);
        return response.data;
      } catch (error) {
        return error.response.data;
      }
}

export const addUserToGroup = async(payload) => {
  try {
      const response = await axiosInstance.put(`/api/chats/addToGroup`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}

export const renameGroup = async(payload) => {
  try {
      const response = await axiosInstance.put(`/api/chats/renameGroup`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}

export const removeUserFromGroup = async(payload) => {
  try {
      const response = await axiosInstance.put(`/api/chats/removeFromGroup`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}

export const addNewAdminToGroup = async(payload) => {
  try {
      const response = await axiosInstance.put(`/api/chats/addNewAdminToGroup`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}

export const removeExistingAdminFromGroup = async(payload) => {
  try {
      const response = await axiosInstance.put(`/api/chats/removeExistingAdminFromGroup`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}

export const LeaveFromGroup = async(payload) => {
  try {
      const response = await axiosInstance.put(`/api/chats/leaveFromGroup`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
}