import PortfolioItem from "@/components/PortfolioItem";
import { fetchAllPortfolios } from "@/api/portfoliosApi";
import { fetchAllCategory } from "@/api/categoriesApi";
import { Container } from "@radix-ui/themes";

export default async function Home() {
  const portfolios = await fetchAllPortfolios();
  const categories = await fetchAllCategory();
  return (
    <Container className="min-h-screen mt-15 bg-white dark:bg-gray-700 shadow-md pb-8">
      <h2 className="text-gray-900 dark:text-white text-3xl font-bold my-6 ">
        Explore
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <PortfolioItem key={portfolio._id} portfolio={portfolio} />
        ))}
      </div>
    </Container>
  );
}
