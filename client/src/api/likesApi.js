import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const likeUnlike = async (id) => {
  try {
    const { data } = await axios.put(`${API_URL}/likes/${id}`, null, {
      withCredentials: true,
    });
    return { success: true, data, isLiked: data.msg.includes("Liked") };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Something went wrong",
    };
  }
};

// GET LIKED PORTFOLIOS BY LOGIN USER
export const fetchLikedPortfolios = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/likes/me`, {
      withCredentials: true,
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching all liked portfolios", error);
    return [];
  }
};
