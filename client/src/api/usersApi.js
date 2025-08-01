import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// REGISTER
export const createUser = async (user) => {
  try {
    const { data } = await axios.post(`${API_URL}/users/register`, user);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Register failed",
    };
  }
};

// LOGIN
export const loginUser = async (user) => {
  try {
    const { data } = await axios.post(`${API_URL}/users/login`, user, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, msg: error.response?.data?.msg || "Login failed" };
  }
};

// REMOVE COOKIE
export const removeCookie = async () => {
  let { data } = await axios.post(`${API_URL}/users/logout`, null, {
    withCredentials: true,
  });
  return data;
};

// UPGRADE TO PREMIUM
export const toPremium = async (id) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/users/premium/${id}`,
      {},
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      msg: data.mag || "User upgraded successfully",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Failed to upgrade account",
    };
  }
};
