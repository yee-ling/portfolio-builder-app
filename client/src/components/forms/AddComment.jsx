"use client";
import { createComment } from "@/api/commentsApi";
import { Popover, Button, Box, Flex, TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "sonner";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

export default function AddComment({ portfolioId, fetchPortfolio }) {
  const [message, setMessage] = useState("");
  const [popOpen, setPopOpen] = useState(false);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await createComment(portfolioId, message);
    if (data) toast.success(data.msg);
    fetchPortfolio();
    setPopOpen(false);
  };

  return (
    <Popover.Root open={popOpen} onOpenChange={setPopOpen}>
      <Popover.Trigger>
        <Button variant="solid">
          <ChatBubbleIcon width="16" height="16" />
          <span>Comment</span>
        </Button>
      </Popover.Trigger>
      <Popover.Content width="360px">
        <form method="POST" onSubmit={handleSubmit}>
          <Flex gap="3">
            <Box flexGrow="1">
              <TextArea
                name="message"
                value={message}
                onChange={handleChange}
                placeholder="Write a comment…"
                style={{ height: 80 }}
              />
              <Flex gap="3" mt="3" justify="end">
                <Button size="1" type="submit">
                  Comment
                </Button>
              </Flex>
            </Box>
          </Flex>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
