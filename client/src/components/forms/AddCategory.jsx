"use client";
import { createCategory } from "@/api/categoriesApi";
import { Flex, Text, TextField, Card, Button } from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "sonner";

export default function AddCategory({ fetchCategories }) {
  const [category, setCategory] = useState({ tag: "" });

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.tag || category.tag.trim() === "") {
      toast.error("Category tag cannot be empty");
      return;
    }

    const result = await createCategory(category);

    if (result.success) {
      toast.success(result.data.msg);
      setCategory({ tag: "" });
      fetchCategories();
    }
  };

  return (
    <Card className="shadow hover:shadow-md transition overflow-hidden">
      <form method="POST" onSubmit={handleSubmit}>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1">
              Category Tag
            </Text>
            <TextField.Root
              name="tag"
              value={category.tag}
              onChange={handleChange}
            />
          </label>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Category
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
