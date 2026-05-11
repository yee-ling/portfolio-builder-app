"use client";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  PinLeftIcon,
} from "@radix-ui/react-icons";
import PortfolioItem from "@/components/PortfolioItem";
import Snowfall from "react-snowfall";

export default function PortfolioList({ portfolios, categories }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const filtered = portfolios
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      selectedCategory ? p.category?.tag === selectedCategory : true
    );

  return (
    <>
      {/* <Snowfall color="white" /> */}
      {/* Search Bar */}
      <div className="flex w-full mt-4 gap-2">
        <div
          onMouseEnter={() => setIsFilterOpen(true)}
          onMouseLeave={() => setIsFilterOpen(false)}
          className="flex gap-2 items-center border-2 dark:border-indigo-500 dark:bg-gray-200 dark:text-dark rounded-full px-16"
        >
          {isFilterOpen ? (
            <PinLeftIcon width="18" height="18" />
          ) : (
            <MixerHorizontalIcon width="18" height="18" />
          )}
          <button onClick={() => setIsFilterOpen(!isFilterOpen)}>Filter</button>
        </div>
        {/* w-3/4 max-w-2xl */}
        <div className="p-[2px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full">
          <div className="flex px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-300 justify-between items-center w-full rounded-full bg-gray-100 dark:bg-gray-600 dark:text-white p-3">
            <input
              className="bg-transparent outline-none w-full placeholder-gray-500 dark:placeholder-gray-300 text-gray-900 dark:text-white"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon width="18" height="18" />
          </div>
        </div>
      </div>

      {/* Explore */}
      <h2 className="text-gray-900 dark:text-white text-3xl font-bold my-6 ">
        Explore
      </h2>
      <div className="flex transition-all duration-300">
        {/* Filter SideBar */}
        <div
          onMouseEnter={() => setIsFilterOpen(true)}
          onMouseLeave={() => setIsFilterOpen(false)}
          className={`overflow-hidden transition-all duration-300 bg-indigo-400 rounded-2xl hover:ring-2 hover:ring-white ${
            isFilterOpen ? "w-64" : "w-0"
          }`}
        >
          <div className="w-64 p-6">
            {/* Category Filter List */}
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.tag)}
                  className={`rounded-xl p-2 hover:text-indigo-800 hover:font-bold hover:bg-indigo-300 transition-all duration-200 text-2xl text-left ${
                    selectedCategory == category.tag
                      ? "text-indigo-800 font-bold"
                      : "text-white"
                  }`}
                >
                  {category.tag}
                </button>
              ))}
              {selectedCategory !== "" && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="bg-indigo-800 hover:bg-indigo-600 rounded-xl border-2 p-2 my-2 dark:text-white text-xl"
                >
                  Clear Category
                </button>
              )}
            </div>
          </div>
        </div>
        <div
          className={`transition-all duration-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1
          ${isFilterOpen ? "ml-8" : ""}`}
        >
          {/* Portfolio Items */}
          {filtered.map((portfolio) => (
            <PortfolioItem key={portfolio._id} portfolio={portfolio} />
          ))}
        </div>
      </div>
    </>
  );
}
