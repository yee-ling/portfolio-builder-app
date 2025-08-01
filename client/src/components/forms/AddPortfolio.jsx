"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { createPortfolio } from "@/api/portfoliosApi";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Box, Flex } from "@radix-ui/themes";
import { fetchAllCategory } from "@/api/categoriesApi";

export default function AddPortfolio() {
  const [categories, setCategories] = useState([]);
  const [portfolio, setPortfolio] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [uploadedFile, setUploadedFile] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetchAllCategory();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => setUploadedFile(e.target.files[0]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await createPortfolio(portfolio, uploadedFile);

    if (data) {
      toast.success(data.msg);
      router.push("/");
    }
  };

  return (
    <div>
      <Dialog.Root>
        <Box>
          <Dialog.Trigger asChild>
            <Flex align="center" justify="center">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <PlusIcon className="w-4 h-4 mr-2" />
                <span>Upload a Portfolio</span>
              </button>
            </Flex>
          </Dialog.Trigger>
        </Box>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="bg-white text-black fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
            <form
              method="POST"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                Add Portfolio
              </Dialog.Title>
              <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
                Upload your portfolio here. Click save when you're done.
              </Dialog.Description>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-[15px] text-violet11"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-700"
                  id="title"
                  type="text"
                  name="title"
                  value={portfolio.title}
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-[15px] text-violet11"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-700"
                  id="description"
                  type="text"
                  name="description"
                  value={portfolio.description}
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-[15px] text-violet11"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  className="w-58 bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-700"
                  name="category"
                  id="category"
                  value={portfolio.category}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category._id}
                      name="category"
                      value={category._id}
                    >
                      {category.tag}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-[15px] text-violet11"
                  htmlFor="uploaded_file"
                >
                  File
                </label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-700"
                  id="uploaded_file"
                  type="file"
                  name="uploaded_file"
                  onChange={handleFile}
                />
              </fieldset>
              <div className="mt-[25px] flex justify-end">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  type="submit"
                >
                  Upload Portfolio
                </button>
              </div>
              <Dialog.Close asChild>
                <button
                  className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
