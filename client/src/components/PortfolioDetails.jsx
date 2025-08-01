"use client";
import { fetchPortfolioById } from "@/api/portfoliosApi";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Inset,
  Text,
  Strong,
  Grid,
  Container,
  Badge,
} from "@radix-ui/themes";
import AddComment from "@/components/forms/AddComment";
import CommentItem from "@/components/CommentItem";
import EditComment from "@/components/forms/EditComment";

export default function PortfolioDetails({ id }) {
  const [portfolio, setPortfolio] = useState(null);
  const [editing, setEditing] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchPortfolio = async () => {
    const data = await fetchPortfolioById(id);

    if (data) {
      setPortfolio(data);
    } else {
      console.error("No portfolio returned");
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex justify-center mt-15">
      {!portfolio ? (
        <p>Portfolio not found.</p>
      ) : (
        <Container size="4" className="mt-15 container">
          <Grid columns={{ initial: "1", md: "2" }} gap="6" width="auto">
            <Box>
              <Card className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <Inset
                  clip="padding-box"
                  side="top"
                  pb="current"
                  align="center"
                >
                  <img
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                    src={`${API_URL}/${portfolio.uploaded_file}`}
                    alt="..."
                  />
                </Inset>
                <Text as="h4" size="5">
                  <Strong>{portfolio.title}</Strong>
                </Text>
                <div>
                  <Text as="h4" size="5">
                    {portfolio.description}
                  </Text>
                </div>
                <Badge className="mt-2">
                  {portfolio.category ? portfolio.category.tag : "No category"}
                </Badge>
              </Card>
            </Box>
            <Box>
              <h3 className="text-2xl text-gray-900 dark:text-white font-semibold mt-6 mb-2">
                Comments
              </h3>
              <div className="mb-4">
                <AddComment
                  portfolioId={portfolio._id}
                  fetchPortfolio={fetchPortfolio}
                />
              </div>
              {portfolio.comments && portfolio.comments.length > 0 ? (
                portfolio.comments.map((comment) =>
                  editing === comment._id ? (
                    <EditComment
                      key={comment._id}
                      comment={comment}
                      fetchPortfolio={fetchPortfolio}
                      setEditing={setEditing}
                    />
                  ) : (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      fetchPortfolio={fetchPortfolio}
                      setEditing={setEditing}
                    />
                  )
                )
              ) : (
                <p className="text-gray-900 dark:text-gray-400 ">
                  No comments yet.
                </p>
              )}
            </Box>
          </Grid>
        </Container>
      )}
    </div>
  );
}
