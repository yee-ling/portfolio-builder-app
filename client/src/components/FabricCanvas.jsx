"use client";
import { Box, Flex, Button } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BoxIcon,
  CircleIcon,
  TextIcon,
  ImageIcon,
  StarFilledIcon,
  Pencil1Icon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import * as fabric from "fabric";
import { useEffect } from "react";
import { deleteDraft } from "@/api/editorsApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PublishToPortfolio from "./forms/PublishToPortfolio";
import { DownloadIcon, TransformIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/AuthContext";
import UpgradeToPro from "./UpgradeToPro";

export default function FabricCanvas({
  handleSave,
  fabricCanvasRef,
  imageInputRef,
  canvasRef,
  onCanvasReady,
  draft,
}) {
  const { user } = useAuth();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      // height: 400,
      // width: 800,
      height: 900,
      width: 900,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    // Store reference to the canvas
    fabricCanvasRef.current = canvas;
    fabricCanvasRef.isDrawingMode = true;

    // OPTIONAL: configure brush
    // canvas.freeDrawingBrush.width = 5;
    // canvas.freeDrawingBrush.color = "#000";

    // Notify parent that canvas is ready
    if (onCanvasReady) {
      onCanvasReady();
    }

    // Cleanup function
    return () => {
      canvas.dispose();
    };
  }, [canvasRef, fabricCanvasRef, onCanvasReady]);

  const addRectangle = () => {
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      fill: "red",
      width: 100,
      height: 80,
      selectable: true,
      hasControls: true,
    });
    fabricCanvasRef.current.add(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 40,
      fill: "green",
      left: 120,
      top: 100,
      selectable: true,
    });
    fabricCanvasRef.current.add(circle);
  };

  const addTextBox = () => {
    const textbox = new fabric.Textbox("Enter text here", {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 20,
      selectable: true,
    });
    fabricCanvasRef.current.add(textbox);
  };

  //New: Add brush
  const addBrush = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    // const brush = new fabric.PencilBrush({
    //   selectable: true,
    // });

    // Optional settings
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "#000000";
    // fabricCanvasRef.current.add(brush);
  };

  const toggleBrush = () => {
    const canvas = fabricCanvasRef.current;
    canvas.isDrawingMode = !canvas.isDrawingMode;
  };

  const handleSelectedColor = (color) => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.set("fill", color);
      canvas.renderAll();
    } else {
      console.error("No object selected");
    }
  };

  const handleSelectedOpacity = (opacity) => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      console.log("Setting opacity:", opacity);
      activeObject.set("opacity", opacity);
      canvas.renderAll();
    } else {
      console.error("No object selected");
    }
  };

  const router = useRouter();
  const handleDelete = () => {
    toast.warning(`Delete ${draft.title}?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteDraft(draft._id);
            toast.success("Deleted successfully");
            router.push("/profile");
          } catch (err) {
            toast.error("Failed to delete");
          }
        },
      },
    });
  };

  const exportAsImage = () => {
    const dataUrl = fabricCanvasRef.current.toDataURL({
      format: "jpeg",
      quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "canvas-export.jpeg";
    link.click();
  };

  // const analyzeLayout = async () => {
  //   try {
  //     const canvasJSON = fabricCanvasRef.current.toJSON();

  //     const response = await fetch("http://127.0.0.1:8000/analyze", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         content: canvasJSON,
  //       }),
  //     });

  //     const data = await response.json();

  //     console.log("Analysis:", data);

  //     toast.success(`Layout Score: ${data.analysis.score}`);

  //     if (data.analysis.issues.length > 0) {
  //       data.analysis.issues.forEach((issue) => {
  //         toast.warning(issue);
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Analysis failed");
  //   }
  // };
  const analyzeLayout = async () => {
    try {
      const canvas = fabricCanvasRef.current;

      const canvasJSON = canvas.toJSON();

      // Check if canvas is empty
      if (!canvasJSON.objects || canvasJSON.objects.length === 0) {
        // toast.warning("No content to analyze");
        toast.info("Add some elements to the canvas before analyzing");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: canvasJSON,
        }),
      });

      const data = await response.json();

      toast.success(`Layout Score: ${data.analysis.score}`);

      if (data.suggestions.length > 0) {
        data.suggestions.forEach((suggestion) => {
          toast.info(suggestion);
        });
      }
      if (data.analysis.issues.length > 0) {
        data.analysis.issues.forEach((issue) => {
          toast.warning(issue);
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed");
    }
  };

  useEffect(() => {
    const handleKeyUp = (e) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const activeObject = canvas.getActiveObject();
      if (e.key === "Delete" || e.key === "Backspace") {
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    };

    // Only run on client
    if (typeof window !== "undefined") {
      document.addEventListener("keyup", handleKeyUp);
    }

    // Cleanup
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [fabricCanvasRef]);

  const applyGradientToActiveObject = (colors = ["#FF0000", "#0000FF"]) => {
    if (!user?.isPremium) {
      toast.error("Gradient fills are a premium feature. Upgrade to access.");
      return;
    }

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (!activeObject) {
      toast.warning("Please select a shape first");
      return;
    }

    activeObject.set(
      "fill",
      new fabric.Gradient({
        type: "linear",
        coords: { x1: 0, y1: 0, x2: activeObject.width, y2: 0 },
        colorStops: [
          { offset: 0, color: colors[0] },
          { offset: 1, color: colors[1] },
        ],
      }),
    );

    fabricCanvasRef.current.renderAll();
  };

  return (
    <Box className="border-l-1 border-gray-500 md:col-span-1 mt-10">
      {/* Top Bar
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/my-portfolios")}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <input
            // value={title}
            // onChange={(e) => setTitle(e.target.value)}
            className="h-8 w-48 sm:w-64 text-sm font-medium border-transparent hover:border-input focus:border-input"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <label className="text-xs text-muted-foreground">BG:</label>
            <input
              type="color"
              // value={bgColor}
              // onChange={(e) => setBgColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border border-border"
            />
          </div>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Draft
          </Button> 
         <Button
            size="sm"
            onClick={handlePublish}
            disabled={publishing}
            className="gap-2"
          >
            {publishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Globe className="h-3.5 w-3.5" />
            )}
            Publish
          </Button> 
        </div>
      </div> */}

      <Flex
        direction={{ base: "row", md: "column" }}
        wrap="wrap"
        align="center"
        justify="center"
        gap="5"
      >
        <div className="grid grid-cols-2 gap-0">
          <button
            className="text-gray-900 focus:outline-none bg-white border border-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 font-bold py-4 px-4 inline-flex justify-center items-center"
            onClick={addRectangle}
          >
            <Flex direction="column" align="center" justify="center" gap="1">
              <BoxIcon width="22" height="22" />

              <span>Rectangle</span>
            </Flex>
          </button>
          <button
            className="text-gray-900 focus:outline-none bg-white border border-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 font-bold py-4 px-4 inline-flex justify-center items-center"
            onClick={addCircle}
          >
            <Flex direction="column" align="center" justify="center" gap="1">
              <CircleIcon width="22" height="22" />
              <span>Circle</span>
            </Flex>
          </button>
          <button
            className="text-gray-900 focus:outline-none bg-white border border-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 font-bold py-4 px-4 inline-flex justify-center items-center"
            onClick={addTextBox}
            size="3"
            color="gray"
            variant="ghost"
          >
            <Flex direction="column" align="center" justify="center" gap="1">
              <TextIcon width="22" height="22" />
              <span>TextBox</span>
            </Flex>
          </button>
          // Pencil Brush
          <button
            className="text-gray-900 focus:outline-none bg-white border border-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 font-bold py-4 px-4 inline-flex justify-center items-center"
            onClick={addBrush}
            size="3"
            color="gray"
            variant="ghost"
          >
            <Flex direction="column" align="center" justify="center" gap="1">
              <Pencil1Icon width="22" height="22" />
              <span>Brush</span>
            </Flex>
          </button>
          <button
            className="text-gray-900 focus:outline-none bg-white border border-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 font-bold py-4 px-4 inline-flex justify-center items-center"
            onClick={() => imageInputRef.current.click()}
          >
            <Flex direction="column" align="center" justify="center" gap="1">
              <ImageIcon width="22" height="22" />
              <span>Image</span>
            </Flex>
          </button>
        </div>

        {/* Gradient (Premium Only) */}
        {user?.isPremium ? (
          <>
            <div className="col-span-2">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-1">
                <StarFilledIcon
                  width="18"
                  height="18"
                  className="text-yellow-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-bold">
                  Premium Gradient
                </span>
              </h4>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="color"
                  defaultValue="#FF0000"
                  onChange={(e) =>
                    applyGradientToActiveObject([e.target.value, "#0000FF"])
                  }
                  className="h-8 w-8"
                />
                <input
                  type="color"
                  defaultValue="#0000FF"
                  onChange={(e) =>
                    applyGradientToActiveObject(["#FF0000", e.target.value])
                  }
                  className="h-8 w-8"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-2 relative">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-1">
              <StarFilledIcon className="text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300 font-bold">
                Premium Gradient
              </span>
            </h4>
            <div className="blur-sm pointer-events-none">
              <h4 className="font-bold text-sm mb-2">Gradient Fill</h4>
              <div className="flex justify-center gap-2">
                <input
                  type="color"
                  defaultValue="#FF0000"
                  disabled
                  className="h-8 w-8"
                />
                <input
                  type="color"
                  defaultValue="#0000FF"
                  disabled
                  className="h-8 w-8"
                />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xs">
              <UpgradeToPro />
            </div>
          </div>
        )}

        <Flex direction="column" gap="2">
          <div>
            <label className="text-gray-500 font-bold" htmlFor="color">
              Color:{" "}
            </label>
            <input
              type="color"
              onChange={(e) => handleSelectedColor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-500 font-bold" htmlFor="opacity">
              Opacity:{" "}
            </label>
            <input
              type="range"
              id="opacity"
              min="0"
              max="1"
              step="0.01"
              defaultValue="0.5"
              onChange={(e) =>
                handleSelectedOpacity(parseFloat(e.target.value))
              }
            />
          </div>
        </Flex>

        <button
          className="w-40 h-12 px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={handleSave}
        >
          Save Draft
        </button>

        {draft?._id && (
          <button
            className="w-40 h-12 px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={handleDelete}
          >
            Delete Draft
          </button>
        )}

        <button
          onClick={exportAsImage}
          className="w-40 h-12 px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex justify-center items-center"
        >
          <DownloadIcon className="w-4 h-4 mr-2" />
          <span>Download</span>
        </button>

        {/* Analyze Button */}
        {/* <button
          onClick={analyzeLayout}
          className="w-40 h-12 px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex justify-center items-center"
        >
          <TransformIcon className="w-4 h-4 mr-2" />
          <span>Analyze</span>
        </button> */}

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="w-40 h-12 px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Publish
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
            <PublishToPortfolio
              fabricCanvasRef={fabricCanvasRef}
              draft={draft}
            />
          </Dialog.Portal>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
