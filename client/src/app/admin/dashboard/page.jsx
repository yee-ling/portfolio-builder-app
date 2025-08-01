"use client";
import { fetchAllCategory } from "@/api/categoriesApi";
import { useEffect, useState } from "react";
import CategoryItem from "@/components/CategoryItem";
import AddCategory from "@/components/forms/AddCategory";
import EditCategory from "@/components/forms/EditCategory";
import { Container, Grid, Table, Card } from "@radix-ui/themes";
import { AdminRoute } from "@/context/AdminRoute";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await fetchAllCategory();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <AdminRoute>
      <Container size="4" className="mt-15">
        <h2 className="my-4">Admin Page: Categories</h2>
        <Grid columns={{ initial: "1", md: "2" }} gap="3" width="auto">
          <AddCategory fetchCategories={fetchCategories} />
          <Container size="4">
            <Card className="shadow hover:shadow-md transition overflow-hidden">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Tag</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                {categories.map((category) =>
                  editing === category._id ? (
                    <EditCategory
                      key={category._id}
                      category={category}
                      fetchCategories={fetchCategories}
                      setEditing={setEditing}
                    />
                  ) : (
                    <CategoryItem
                      key={category._id}
                      category={category}
                      fetchCategories={fetchCategories}
                      setEditing={setEditing}
                    />
                  )
                )}
              </Table.Root>
            </Card>
          </Container>
        </Grid>
      </Container>
    </AdminRoute>
  );
}
