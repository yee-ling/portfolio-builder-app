"use client";
import { editComment } from "@/api/commentsApi";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Flex } from "@radix-ui/themes";

export default function EditComment({ comment, fetchPortfolio, setEditing }) {
  const [updatedComment, setUpdatedComment] = useState(comment);

  const handleChange = (e) => {
    setUpdatedComment({ ...updatedComment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await editComment(updatedComment);

    if (result.success) {
      toast.success(result.data.msg);
      fetchPortfolio();
      setEditing(null);
    }
  };

  return (
    <div key={updatedComment._id} className="border bg-white p-4 rounded mb-3">
      <form method="PUT" onSubmit={handleSubmit}>
        <Flex justify="between" gap="1">
          <input
            type="text"
            name="message"
            value={updatedComment.message}
            onChange={handleChange}
            className="bg-blue-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded w-full"
          />
          <Button type="submit" variant="soft">
            Save
          </Button>
          <Button onClick={() => setEditing(null)} variant="soft" color="red">
            Cancel
          </Button>
        </Flex>
      </form>
      <p className="text-sm text-gray-500 mt-1">
        - {comment.user?.username || "Anonymous"}
      </p>
    </div>
  );
}
