"use client";
import { editCategory } from "@/api/categoriesApi";
import { Table, Button } from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "sonner";

export default function EditCategory({
  category,
  fetchCategories,
  setEditing,
}) {
  const [updatedCategory, setUpdatedCategory] = useState(category);

  const handleChange = (e) => {
    setUpdatedCategory({ ...updatedCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedCategory.tag || updatedCategory.tag.trim() === "") {
      toast.error("Category tag cannot be empty");
      return;
    }

    const result = await editCategory(updatedCategory);

    if (result.success) {
      toast.success(result.data.msg);
      fetchCategories();
      setEditing(null);
    }
  };

  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell>
          <form method="PUT" onSubmit={handleSubmit}>
            <input
              type="text"
              name="tag"
              value={updatedCategory.tag}
              onChange={handleChange}
              className="bg-blue-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded w-full"
            />
          </form>
        </Table.Cell>
        <Table.Cell>
          <Button
            color="orange"
            type="submit"
            variant="soft"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
}
