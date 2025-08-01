import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET ALL PORTFOLIOS
export const fetchAllPortfolios = async () => {
  const { data } = await axios.get(`${API_URL}/portfolios`);
  return data;
};

// GET ALL PORTFOLIOS BY LOGIN USER
export const getMyPortfolios = async () => {
  let { data } = await axios.get(`${API_URL}/portfolios/me`, {
    withCredentials: true,
  });
  return data;
};

// ADD PORTFOLIO
export const createPortfolio = async (portfolio, uploaded_file) => {
  const formData = new FormData();
  formData.append("title", portfolio.title);
  formData.append("description", portfolio.description);
  formData.append("category", portfolio.category);
  formData.append("uploaded_file", uploaded_file);

  const { data } = await axios.post(`${API_URL}/portfolios`, formData, {
    withCredentials: true,
  });
  return data;
};

// DELETE PORTFOLIO
export const deletePortfolio = async (id) => {
  const { data } = await axios.delete(`${API_URL}/portfolios/${id}`, {
    withCredentials: true,
  });
  return data;
};

// EDIT PORTFOLIO
export const editPortfolio = async (updatedPortfolio, updatedFile) => {
  const formData = new FormData();
  formData.append("title", updatedPortfolio.title);
  formData.append("description", updatedPortfolio.description);
  formData.append("uploaded_file", updatedFile);

  const { data } = await axios.put(
    `${API_URL}/portfolios/${updatedPortfolio._id}`,
    formData,
    { withCredentials: true }
  );
  return data;
};

// GET PORTFOLIO BY ID
export const fetchPortfolioById = async (id) => {
  const { data } = await axios.get(`${API_URL}/portfolios/${id}`);
  return data;
};
