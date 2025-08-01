"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Box,
  Tabs,
  Avatar,
  Flex,
  DataList,
  IconButton,
} from "@radix-ui/themes";
import { Pencil1Icon, CopyIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import AddPortfolio from "@/components/forms/AddPortfolio";
import PortfolioItem from "@/components/PortfolioItem";
import DraftItem from "@/components/DraftItem";
import UpgradeToPro from "@/components/UpgradeToPro";
import { getMyPortfolios } from "@/api/portfoliosApi";
import { fetchLikedPortfolios } from "@/api/likesApi";
import { fetchSavedPortfolios } from "@/api/savesApi";
import { fetchAllDrafts } from "@/api/editorsApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Profile() {
  const [portfolios, setPortfolios] = useState([]);
  const [likedPortfolios, setLikedPortfolios] = useState([]);
  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser, fetchUser } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchMyPortfolios = async () => {
    setLoading(true);
    try {
      const data = await getMyPortfolios();
      setPortfolios(data);
    } catch (e) {
      console.error(e);
      setPortfolios([]);
    }
    setLoading(false);
  };

  const fetchLiked = async () => {
    try {
      const data = await fetchLikedPortfolios();
      setLikedPortfolios(data);
    } catch (e) {
      console.error(e);
      setLikedPortfolios([]);
    }
  };

  const fetchSaved = async () => {
    try {
      const data = await fetchSavedPortfolios();
      setSavedPortfolios(data);
    } catch (e) {
      console.error(e);
      setSavedPortfolios([]);
    }
  };

  const fetchMyDrafts = async () => {
    try {
      const data = await fetchAllDrafts();
      setDrafts(data);
    } catch (e) {
      console.error(e);
      setDrafts([]);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMyPortfolios();
    fetchLiked();
    fetchSaved();
    fetchMyDrafts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Box>
      <div className="min-h-screen bg-white dark:bg-gray-800 mt-15">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Profile Info */}
            <Box className="col-span-1 mt-6">
              <Flex direction="column" align="center" gap="4">
                <Avatar
                  variant="solid"
                  color="orange"
                  size="6"
                  radius="full"
                  fallback={user?.fullname?.[0]?.toUpperCase() || "?"}
                />

                {/* Upgrade to Pro */}
                {!user?.isPremium && <UpgradeToPro />}
                {user?.isPremium && (
                  <div className="mt-2">
                    <span className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                      Premium User
                    </span>
                  </div>
                )}

                <DataList.Root>
                  <DataList.Item align="center">
                    <DataList.Label minWidth="88px">
                      <h3 className="text-gray-900 dark:text-white mt-5 text-base tracking-tight">
                        Name:
                      </h3>
                    </DataList.Label>
                    <DataList.Value>
                      <h3 className="text-gray-900 dark:text-white mt-5 text-base tracking-tight">
                        {user?.fullname}
                      </h3>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">
                      <h3 className="text-gray-900 dark:text-white mt-5 text-base tracking-tight">
                        Username:
                      </h3>
                    </DataList.Label>
                    <DataList.Value>
                      <h3 className="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight">
                        {user?.username}
                      </h3>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">
                      <h3 className="text-gray-900 dark:text-white mt-5 text-base tracking-tight">
                        Email:
                      </h3>
                    </DataList.Label>
                    <DataList.Value>
                      <Flex align="center" gap="2">
                        <h3 className="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight">
                          {user?.email}
                        </h3>
                        <IconButton
                          size="1"
                          aria-label="Copy value"
                          variant="ghost"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Flex>
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </Flex>
            </Box>

            {/* Tabs */}
            <Box className="col-span-2 mt-6">
              <Tabs.Root defaultValue="portfolio">
                <Tabs.List color="cyan" size="2">
                  <Tabs.Trigger value="portfolio">
                    <h2 className="text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      Portfolio
                    </h2>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="liked">
                    <h2 className="text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      Liked
                    </h2>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="saved">
                    <h2 className="text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      Saved
                    </h2>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="draft">
                    <h2 className="text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      Draft
                    </h2>
                  </Tabs.Trigger>
                </Tabs.List>

                <Box pt="3">
                  <Tabs.Content value="portfolio">
                    <div className="flex items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card>
                        <Flex
                          gap="4"
                          direction="column"
                          align="center"
                          justify="center"
                          className="p-6"
                        >
                          <AddPortfolio />

                          <Link href="/profile/editor">
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                              <Pencil1Icon className="w-5 h-4 mr-2" />
                              <span>Create a Portfolio</span>
                            </button>
                          </Link>
                        </Flex>
                      </Card>
                      {portfolios.map((portfolio) => (
                        <PortfolioItem
                          key={portfolio._id}
                          portfolio={portfolio}
                          isProfile
                          fetchMyPortfolios={fetchMyPortfolios}
                        />
                      ))}
                    </div>
                  </Tabs.Content>
                  <Tabs.Content value="liked">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {likedPortfolios.length ? (
                        likedPortfolios.map((portfolio) => (
                          <PortfolioItem
                            key={portfolio._id}
                            portfolio={portfolio}
                          />
                        ))
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          No liked portfolios yet
                        </p>
                      )}
                    </div>
                  </Tabs.Content>
                  <Tabs.Content value="saved">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedPortfolios.length ? (
                        savedPortfolios.map((portfolio) => (
                          <PortfolioItem
                            key={portfolio._id}
                            portfolio={portfolio}
                          />
                        ))
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          No saved portfolios yet
                        </p>
                      )}
                    </div>
                  </Tabs.Content>
                  <Tabs.Content value="draft">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card>
                        <Flex
                          gap="4"
                          direction="column"
                          align="center"
                          justify="center"
                          className="p-6"
                        >
                          <Link href="/profile/editor">
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                              <Pencil1Icon className="w-5 h-4 mr-2" />
                              <span>Create a Portfolio</span>
                            </button>
                          </Link>
                        </Flex>
                      </Card>

                      {drafts?.map((draft) => (
                        <DraftItem key={draft._id} draft={draft} />
                      ))}
                    </div>
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
}
