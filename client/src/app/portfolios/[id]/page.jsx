import PortfolioDetails from "@/components/PortfolioDetails";

export default async function PortfolioPage({ params }) {
  const { id } = await params;
  return <PortfolioDetails id={id} />;
}
