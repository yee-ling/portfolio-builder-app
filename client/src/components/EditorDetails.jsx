"use client";
import { useEffect, useState, useRef } from "react";
import { getDraftById, editDraft, uploadImage } from "@/api/editorsApi";
import FabricCanvas from "./FabricCanvas";
import { Box, Flex } from "@radix-ui/themes";
import { toast } from "sonner";
import * as fabric from "fabric";
import { useRouter } from "next/navigation";

export default function EditorDetails({ id }) {
  const [draft, setDraft] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const imageInputRef = useRef();

  const fetchDraftById = async () => {
    const data = await getDraftById(id);
    if (data) {
      setDraft(data);
    } else {
      console.error("No draft returned");
    }
  };

  useEffect(() => {
    fetchDraftById();
  }, [id]);

  useEffect(() => {
    if (draft && canvasReady && fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current.loadFromJSON(draft.content, () => {
          fabricCanvasRef.current.renderAll();
          fabricCanvasRef.current.setWidth(842);
          fabricCanvasRef.current.setHeight(595);
        });
      } catch (error) {
        console.error("Error loading canvas from JSON:", error);
      }
    }
  }, [draft, canvasReady]);

  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();
    const content = fabricCanvasRef.current?.toJSON();
    const updatedDraft = {
      ...draft,
      title: draft.title,
      description: draft.description,
      content,
    };
    const res = await editDraft(updatedDraft);
    if (res.success) {
      toast.success(res.message);
      router.push("/profile");
    } else {
      toast.error(res.message);
    }
  };

  const handleImage = async (e) => {
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
      const scale = Math.min(scaleX, scaleY, 1);

      const imgObj = new fabric.Image(img, {
        left: (maxWidth - img.width * scale) / 2,
        top: (maxHeight - img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        centeredRotation: true,
        centeredScaling: true,
      });

      fabricCanvasRef.current.add(imgObj);
      fabricCanvasRef.current.renderAll();
    };

    img.src = url;
  };

  return (
    <div className="mt-15 min-h-screen bg-white dark:bg-gray-800">
      {!draft ? (
        <p>Loading draft...</p>
      ) : (
        <>
          <div className="p-6 mt-15">
            <h1 className="text-2xl text-gray-500 font-bold">{draft.title}</h1>
            <p className="text-gray-500">{draft.description}</p>

            {/* Saved Canvas Draft */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <Box className="md:col-span-2">
                <Flex direction="column" align="center" gap="3">
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImage}
                    style={{ display: "none" }}
                  />
                  <div className="flex justify-center w-full max-w-full overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="border w-full h-auto shadow-md"
                    />
                  </div>
                </Flex>
              </Box>

              <FabricCanvas
                handleSave={handleSave}
                fabricCanvasRef={fabricCanvasRef}
                canvasRef={canvasRef}
                imageInputRef={imageInputRef}
                onCanvasReady={() => setCanvasReady(true)}
                draft={draft}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
