"use client";
import {
  Box,
  Text,
  Strong,
  Flex,
  IconButton,
  Badge,
  Avatar,
} from "@radix-ui/themes";
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
    <div className="group hover:rounded-lg overflow-hidden bg-white dark:bg-transparent hover:shadow-sm hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-500/40 transition-transform duration-300 ease-in-out">
      <div className="hover:scale-[0.91] transition-transform duration-200 ease-in-out">
        <Link href={`/portfolios/${portfolio._id}`}>
          <img
            className="w-full h-60 rounded-xl object-fill"
            src={`${API_URL}/${portfolio.uploaded_file}`}
            alt="..."
          />
        </Link>
        {/* <div className="bg-white py-4"> */}
        <div
          className={`${isProfile ? "bg-transparent" : "bg-transparent"} mt-2`}
        >
          <div
            className={`${
              isProfile
                ? "flex gap-2 items-center mb-2 justify-between"
                : "flex gap-2 items-center mb-2"
            }`}
          >
            <div className="flex gap-2 items-center">
              <div className="font-bold text-xl">
                <Link href={`/portfolios/${portfolio._id}`}>
                  <h3 className="line-clamp-1 text-gray-900 dark:text-white text-base font-medium tracking-tight hover:underline">
                    {portfolio.title}
                  </h3>
                </Link>
              </div>
              <Badge size="1" color="indigo" variant="surface">
                {portfolio.category ? portfolio.category.tag : "No category"}
              </Badge>
            </div>
            {isProfile && (
              <Flex
                gap="3"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-100"
              >
                <Dialog.Root>
                  <Box className="flex justify-center">
                    <Dialog.Trigger asChild>
                      <IconButton color="indigo" radius="full" size="2">
                        <Pencil2Icon width="18" height="18" />
                      </IconButton>
                    </Dialog.Trigger>
                    <EditPortfolio portfolio={portfolio} />
                  </Box>
                </Dialog.Root>

                <IconButton
                  color="red"
                  size="2"
                  radius="full"
                  onClick={handleDelete}
                >
                  <TrashIcon width="18" height="18" />
                </IconButton>
              </Flex>
            )}
          </div>
          {isProfile && (
            <Flex justify="between">
              <p className="line-clamp-2 dark:text-white text-gray-800 text-base">
                {portfolio.description}
              </p>
              <div className="flex gap-2">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {portfolio.user.username}
                </p>
              </div>
              <Text as="h5" size="4" className="text-gray-800 font-bold">
                <Flex gap="4">
                  <Flex gap="1">
                    <button
                      className="text-gray-500 dark:text-gray-400"
                      onClick={handleLike}
                    >
                      {isLikedState ? <HeartFilledIcon /> : <HeartIcon />}
                    </button>
                    <div className="text-gray-500 dark:text-gray-400">
                      {likesCount}
                    </div>
                  </Flex>
                  <Flex gap="1">
                    <button
                      className="text-gray-500 dark:text-gray-400"
                      onClick={handleSave}
                    >
                      {isSavedState ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                    </button>
                    <div className="text-gray-500 dark:text-gray-400">
                      {savesCount}
                    </div>
                  </Flex>
                </Flex>
              </Text>
            </Flex>
          )}
          {/* Avatar & Username */}
          {!isProfile && (
            <Flex justify="between">
              <div className="flex gap-2">
                {/* <Avatar
                  variant="solid"
                  color="orange"
                  size="1"
                  radius="full"
                  fallback={portfolio.user.username[0].toUpperCase()}
                /> */}
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {portfolio.user.username}
                </p>
              </div>
              <Text as="h5" size="4" className="text-gray-800 font-bold">
                <Flex gap="4">
                  <Flex gap="1">
                    <button
                      className="text-gray-500 dark:text-gray-400"
                      onClick={handleLike}
                    >
                      {isLikedState ? <HeartFilledIcon /> : <HeartIcon />}
                    </button>
                    <div className="text-gray-500 dark:text-gray-400">
                      {likesCount}
                    </div>
                  </Flex>
                  <Flex gap="1">
                    <button
                      className="text-gray-500 dark:text-gray-400"
                      onClick={handleSave}
                    >
                      {isSavedState ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                    </button>
                    <div className="text-gray-500 dark:text-gray-400">
                      {savesCount}
                    </div>
                  </Flex>
                </Flex>
              </Text>
            </Flex>
          )}
        </div>
        <div
          className={`${
            isProfile ? "bg-transparent px-4 pb-2" : "bg-transparent"
          }`}
        >
          {/* Profile Page */}
          {/* {isProfile && (
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
          )} */}
        </div>
      </div>
    </div>
  );
}
