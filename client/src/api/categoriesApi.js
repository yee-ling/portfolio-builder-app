import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ADD CATEGORY
export const createCategory = async (category) => {
  try {
    let { data } = await axios.post(`${API_URL}/categories`, category, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.msg || "Cannot add category",
    };
  }
};

// GET ALL CATEGORY
export const fetchAllCategory = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/categories`);
    return data;
  } catch (error) {
    console.error("Error fetching all categories", error);
    return [];
  }
};

// DELETE CATEGORY
export const deleteCategory = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/categories/${id}`, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.msg || "Cannot delete category",
    };
  }
};

// EDIT CATEGORY
export const editCategory = async (updatedCategory) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/categories/${updatedCategory._id}`,
      { tag: updatedCategory.tag },
      { withCredentials: true }
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.msg || "Cannot edit category",
    };
  }
};

// GET CATEGORY BY ID
export const fetchCategoryById = async (id) => {
  const { data } = await axios.get(`${API_URL}/categories/${id}`);
  return data;
};
