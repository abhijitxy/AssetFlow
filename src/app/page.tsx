import { Navbar } from "~/app/_components/Navbar";
import { Maincontent } from "~/app/_components/Maincontent";
import { BackgroundEffects } from "~/app/_components/BackgroundEffects";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="min-h-screen w-full bg-black overflow-x-hidden">
        <BackgroundEffects />
        <main className="relative z-10 flex flex-col items-center justify-between px-4 py-12 md:px-24 text-white">
          <Navbar /> {/* You might need to modify Navbar to accept session prop */}
          <Maincontent />
        </main>
      </div>
    </HydrateClient>
  );
}