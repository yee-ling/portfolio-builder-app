import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET ALL DRAFTS OF LOGIN USER
export const fetchAllDrafts = async () => {
  let { data } = await axios.get(`${API_URL}/editors`, {
    withCredentials: true,
  });
  return data;
};

// GET A DRAFT BY LOGIN USER
export const getDraftById = async (id) => {
  let { data } = await axios.get(`${API_URL}/editors/draft/${id}`, {
    withCredentials: true,
  });
  return data;
};

// CREATE NEW DRAFT/ADD DRAFT
export const createDraft = async (draft) => {
  const { data } = await axios.post(`${API_URL}/editors`, draft, {
    withCredentials: true,
  });
  return data;
};

// ADD IMAGE TO DRAFT
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const { data } = await axios.post(
    `${API_URL}/editors/upload-image`,
    formData,
    {
      withCredentials: true,
    }
  );
  return data;
};

// DELETE DRAFT
export const deleteDraft = async (id) => {
  const { data } = await axios.delete(`${API_URL}/editors/${id}`, {
    withCredentials: true,
  });
  return data;
};

// UPDATE DRAFT
export const editDraft = async (updatedDraft) => {
  try {
    const formData = new FormData();
    formData.append("title", updatedDraft.title);
    formData.append("description", updatedDraft.description);
    formData.append("content", JSON.stringify(updatedDraft.content));

    if (updatedDraft.imageFile) {
      formData.append("image", updatedDraft.imageFile);
    }

    const { data } = await axios.put(
      `${API_URL}/editors/${updatedDraft._id}`,
      formData,
      {
        withCredentials: true,
      }
    );
    return { success: true, message: data.msg || "Draft updated" };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.msg || "Cannot edit draft",
    };
  }
};
