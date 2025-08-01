"use client";
import { Box, Text, Strong, Flex, IconButton, Badge } from "@radix-ui/themes";
import {
  Pencil2Icon,
  TrashIcon,
  HeartIcon,
  HeartFilledIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
} from "@radix-ui/react-icons";
import { deletePortfolio } from "@/api/portfoliosApi";
import { toast } from "sonner";
import EditPortfolio from "./forms/EditPortfolio";
import * as Dialog from "@radix-ui/react-dialog";
import { likeUnlike } from "@/api/likesApi";
import { saveUnsave } from "@/api/savesApi";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function PortfolioItem({
  portfolio,
  isProfile = false,
  fetchMyPortfolios,
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useAuth();
  const [isLikedState, setIsLikedState] = useState(
    portfolio.likes.some((like) => like.user === user?._id)
  );
  const [likesCount, setLikesCount] = useState(portfolio.likes.length);
  const [isSavedState, setIsSavedState] = useState(
    portfolio.saves.some((save) => save.user === user?._id)
  );
  const [savesCount, setSavesCount] = useState(portfolio.saves.length);

  const handleLike = async () => {
    const result = await likeUnlike(portfolio._id);

    if (result.success) {
      setIsLikedState(result.isLiked);
      setLikesCount((prev) => (result.isLiked ? prev + 1 : prev - 1));
    } else {
      console.error(result.msg);
    }
  };

  const handleSave = async () => {
    const result = await saveUnsave(portfolio._id);
    if (result.success) {
      setIsSavedState(result.isSaved);
      setSavesCount((prev) => (result.isSaved ? prev + 1 : prev - 1));
    } else {
      console.error(result.msg);
    }
  };

  const handleDelete = () => {
    toast.warning(`Delete ${portfolio.title}?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deletePortfolio(portfolio._id);
            toast.success("Deleted successfully");
            fetchMyPortfolios();
          } catch (err) {
            toast.error("Failed to delete");
          }
        },
      },
    });
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full h-60 border-4 border-indigo-200 border-l-indigo-500"
        src={`${API_URL}/${portfolio.uploaded_file}`}
        alt="..."
      />
      <div className="bg-white px-6 py-4">
        <div className="font-bold text-xl mb-2">
          <Link
            className="text-gray-900 hover:underline"
            href={`/portfolios/${portfolio._id}`}
          >
            <Strong>{portfolio.title}</Strong>
          </Link>
        </div>
        <p className="text-gray-800 text-base">{portfolio.description}</p>
        <p className="text-gray-800 text-base">{portfolio.user.username}</p>
      </div>
      <div className="bg-white px-6 pb-2">
        <Flex justify="between">
          <Badge size="3" color="indigo">
            {portfolio.category ? portfolio.category.tag : "No category"}
          </Badge>
          <Text as="h5" size="4" className="text-gray-800 font-bold">
            <Flex gap="4">
              <Flex gap="1">
                <button onClick={handleLike}>
                  {isLikedState ? <HeartFilledIcon /> : <HeartIcon />}
                </button>
                <div>{likesCount}</div>
              </Flex>
              <Flex gap="1">
                <button onClick={handleSave}>
                  {isSavedState ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                </button>
                <div>{savesCount}</div>
              </Flex>
            </Flex>
          </Text>
        </Flex>

        {isProfile && (
          <Flex gap="2" className="mt-2">
            <Dialog.Root>
              <Box className="flex justify-center">
                <Dialog.Trigger asChild>
                  <IconButton size="2">
                    <Pencil2Icon width="18" height="18" />
                  </IconButton>
                </Dialog.Trigger>
                <EditPortfolio portfolio={portfolio} />
              </Box>
            </Dialog.Root>

            <IconButton color="red" size="2" onClick={handleDelete}>
              <TrashIcon width="18" height="18" />
            </IconButton>
          </Flex>
        )}
      </div>
    </div>
  );
}
