import Image from "next/image";

export function Maincontent() {
  return (
    <>
      <div className="mb-12 max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-medium sm:text-6xl">
          Your Assets, Your Control{" "}
          <span className="animate-text-gradient inline-flex bg-gradient-to-r from-neutral-500 via-slate-500 to-neutral-900 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
            Instantly
          </span>
        </h2>
        <p className="mt-6 text-sm leading-6 text-gray-300">
          AssetFlow simplifies digital asset ownership. Instantly manage your
          assets, track ownership history, and transfer assets
          seamlessly.
        </p>
      </div>

      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl">
          <div className="overflow-hidden rounded-lg border-[6px] border-neutral-950 sm:border-[8px] md:border-[10px]">
            <Image
              src="/hero.webp"
              alt="Dashboard"
              width={1200}
              height={800}
              layout="responsive"
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
