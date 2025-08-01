import { Table, Flex, Button } from "@radix-ui/themes";
import { deleteCategory } from "@/api/categoriesApi";
import { toast } from "sonner";

export default function CategoryItem({
  category,
  fetchCategories,
  setEditing,
}) {
  const handleDelete = () => {
    toast.warning(`Delete ${category.tag} ?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteCategory(category._id);
            toast.success("Deleted successfully");
            fetchCategories();
          } catch (err) {
            toast.error("Failed to delete");
          }
        },
      },
    });
  };

  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell>{category.tag}</Table.Cell>
        <Table.Cell>
          <Flex gap="3">
            <Button variant="soft" onClick={() => setEditing(category._id)}>
              Edit
            </Button>
            <Button variant="soft" color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Flex>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
}
