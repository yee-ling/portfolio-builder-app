"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { fetchAllCategory } from "@/api/categoriesApi";
import { useState, useEffect } from "react";
import { createPortfolio } from "@/api/portfoliosApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PublishToPortfolio({ fabricCanvasRef, draft }) {
  const [categories, setCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [portfolio, setPortfolio] = useState({
    title: draft?.title || "",
    description: draft?.description || "",
    category: draft?.category || "",
  });

  const handleChange = (e) => {
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const canvasData = fabricCanvasRef.current.toDataURL({
        format: "jpeg",
        quality: 1,
      });

      // Convert dataURL to Blob
      const res = await fetch(canvasData);
      const blob = await res.blob();
      const file = new File([blob], "canvas.jpg", { type: "image/jpeg" });

      await createPortfolio(
        {
          title: portfolio.title,
          description: portfolio.description,
          category: portfolio.category,
        },
        file
      );
      toast.success("Published successfully");
      router.push("/profile");
    } catch (error) {
      console.error("Failed to publish");
    }
  };

  const previewCanvas = () => {
    const dataUrl = fabricCanvasRef.current.toDataURL({
      format: "jpeg",
      quality: 1,
    });
    setPreviewUrl(dataUrl);
  };

  useEffect(() => {
    if (fabricCanvasRef.current) {
      previewCanvas();
    }
    const fetchCategories = async () => {
      const data = await fetchAllCategory();
      setCategories(data);
    };
    fetchCategories();
  }, [fabricCanvasRef]);

  return (
    <Dialog.Content className="bg-white text-black fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
      <Dialog.Title>Publish to Portfolio</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        Publish your work. Click save when you're done.
      </Dialog.Description>
      {previewUrl && (
        <img className="border my-3" src={previewUrl} alt="Canvas preview" />
      )}
      <form
        method="POST"
        onSubmit={handlePublish}
        encType="multipart/form-data"
      >
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
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category._id} name="category" value={category._id}>
                {category.tag}
              </option>
            ))}
          </select>
        </fieldset>
        <div className="mt-[25px] flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            type="submit"
          >
            Publish
          </button>
        </div>
      </form>
    </Dialog.Content>
  );
}
