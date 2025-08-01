import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ADD COMMENT
export const createComment = async (portfolioId, comment) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/comments/${portfolioId}`,
      { message: comment },
      {
        withCredentials: true,
      }
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.msg || "Cannot add comment",
    };
  }
};

// DELETE COMMENT
export const deleteComment = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/comments/${id}`, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.msg || "Cannot delete comment",
    };
  }
};

// EDIT COMMENT
export const editComment = async (updatedComment) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/comments/${updatedComment._id}`,
      { message: updatedComment.message },
      { withCredentials: true }
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.msg || "Cannot edit comment",
    };
  }
};
