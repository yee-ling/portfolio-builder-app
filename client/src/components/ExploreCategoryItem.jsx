import { Flex, Button } from "@radix-ui/themes";

export default function ExploreCategoryItem({ category }) {
  return (
    <Flex gap="2">
      <Button>{category.tag}</Button>
    </Flex>
  );
}
