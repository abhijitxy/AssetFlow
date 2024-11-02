import { Suspense } from "react";
import { api } from "~/trpc/server";
import { NFTDashboard } from "./components/nft-dashboard";
import { HydrateClient } from "~/trpc/server";

export default async function DashboardPage() {
  const initialAssets = await api.asset.getAll();
  const initialUsers = await api.user.getAll();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HydrateClient>
        <NFTDashboard initialAssets={initialAssets} initialUsers={initialUsers} />
      </HydrateClient>
    </Suspense>
  );
}