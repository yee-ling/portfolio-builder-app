"use client";
import Link from "next/link";
import { Box, Card, Flex, Text, Strong } from "@radix-ui/themes";

export default function DraftItem({ draft }) {
  return (
    <Box className="shadow hover:shadow-md transition overflow-hidden">
      <Card>
        <Flex
          gap="2"
          direction="column"
          align="start"
          justify="center"
          className="p-6"
        >
          <Link
            className="hover:underline"
            href={`/profile/editor/${draft._id}`}
          >
            <Strong>{draft.title}</Strong>
          </Link>

          <Text as="p" size="3">
            {draft.description}
          </Text>
        </Flex>
      </Card>
    </Box>
  );
}
