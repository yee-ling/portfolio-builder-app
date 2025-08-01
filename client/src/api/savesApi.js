import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const saveUnsave = async (id) => {
  try {
    const { data } = await axios.put(`${API_URL}/saves/${id}`, null, {
      withCredentials: true,
    });
    return { success: true, data, isSaved: data.msg.includes("Saved") };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Something went wrong",
    };
  }
};

// GET SAVED PORTFOLIOS BY LOGIN USER
export const fetchSavedPortfolios = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/saves/me`, {
      withCredentials: true,
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching all saved portfolios", error);
    return [];
  }
};
