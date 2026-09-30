import { DiscoveryPage } from "@/components/discovery/DiscoveryPage";
import { metadata } from "@/learning/seo";
import { surfaces } from "@/discovery/query";
export const dynamic = "force-dynamic";
export const generateMetadata = () =>
  metadata(
    surfaces.search.title,
    surfaces.search.description,
    "/search",
    false,
  );
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DiscoveryPage surface="search" raw={await searchParams} />;
}
