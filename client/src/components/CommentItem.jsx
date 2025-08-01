"use client";
import { deleteComment } from "@/api/commentsApi";
import { DropdownMenu, Flex, Button } from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CommentItem({ comment, fetchPortfolio, setEditing }) {
  const { user } = useAuth();
  const isCommenter = comment.user._id === user?._id;

  const handleDelete = () => {
    toast.warning(`Delete this comment: ${comment.message}?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteComment(comment._id);
            toast.success("Deleted successfully");
            fetchPortfolio();
          } catch (err) {
            toast.error("Failed to delete");
          }
        },
      },
    });
  };

  return (
    <div key={comment._id} className="border dark:bg-white p-4 rounded mb-3">
      <Flex justify="between">
        <p className="mt-1">{comment.message}</p>
        {isCommenter && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="soft">
                <DotsVerticalIcon />
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => setEditing(comment._id)}>
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={handleDelete}>
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </Flex>

      <p className="text-sm text-gray-500 mt-1">
        - {comment.user?.username || "Anonymous"}
      </p>
    </div>
  );
}
