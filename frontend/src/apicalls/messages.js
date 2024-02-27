import { axiosInstance } from ".";

export const sendNewMessage = async(payload) => {
    try {
      const response = await axiosInstance.post(`/api/messages/sendMessage`,payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const allMessagesOfChat = async(id) => {
  try {
    const response = await axiosInstance.get(`/api/messages/allMessages/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};