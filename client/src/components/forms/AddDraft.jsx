"use client";
import * as fabric from "fabric";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Box, Flex } from "@radix-ui/themes";
import { uploadImage } from "@/api/editorsApi";
import { createDraft } from "@/api/editorsApi";
import { useRouter } from "next/navigation";
import FabricCanvas from "../FabricCanvas";

export default function AddDraft() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const imageInputRef = useRef();
  const router = useRouter();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    const content = fabricCanvasRef.current?.toJSON();
    const draft = { title, description, content };
    const res = await createDraft(draft);
    toast.success(res.msg);
    router.push("/profile");
  };

  const handleImage = async (e) => {
    // console.log(img);
    const file = e.target.files[0];
    if (!file) return;

    const { url } = await uploadImage(file);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = fabricCanvasRef.current;
      const maxWidth = canvas.getWidth();
      const maxHeight = canvas.getHeight();

      const scaleX = maxWidth / img.width;
      const scaleY = maxHeight / img.height;
      const scale = Math.min(scaleX, scaleY, 1); // Ensure image never scales up

      const imgObj = new fabric.Image(img, {
        left: (maxWidth - img.width * scale) / 2,
        top: (maxHeight - img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        centeredRotation: true,
        centeredScaling: true,
        // const imgObj = new fabric.Image(img, {
        //   left: 100,
        //   top: 60,
        //   scaleX: 0.5,
        //   scaleY: 0.5,
        //   centeredRotation: true,
        //   centeredScaling: true,
      });

      fabricCanvasRef.current.add(imgObj);
      fabricCanvasRef.current.renderAll();
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen mt-15 bg-white dark:bg-gray-800 grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
      <Box className="md:col-span-2 mt-15">
        <Flex direction="column" align="center" gap="3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Untitled…"
          />
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Write a description…"
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImage}
            style={{ display: "none" }}
          />
          <div className="mt-5 flex justify-center w-full max-w-full overflow-hidden">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-700 dark:border-gray-500 w-full h-auto shadow-md"
            />
          </div>
        </Flex>
      </Box>

      <FabricCanvas
        handleSave={handleSave}
        fabricCanvasRef={fabricCanvasRef}
        imageInputRef={imageInputRef}
        canvasRef={canvasRef}
      />
    </div>
  );
}
