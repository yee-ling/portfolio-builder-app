import { fetchAllPortfolios } from "@/api/portfoliosApi";
import { fetchAllCategory } from "@/api/categoriesApi";
import { Container } from "@radix-ui/themes";
import PortfolioList from "@/components/PortfolioList";

export default async function Home() {
  const portfolios = await fetchAllPortfolios();
  const categories = await fetchAllCategory();
  return (
    // <Container className="min-h-screen mt-15 bg-white dark:bg-gray-700 shadow-md pb-8">
    //   <PortfolioList portfolios={portfolios} />
    // </Container>
    <div className="min-h-screen mt-16 bg-white dark:bg-gray-700 shadow-md px-8 py-4">
      <PortfolioList portfolios={portfolios} categories={categories} />
    </div>
  );
}
