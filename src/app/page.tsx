import { DogLionScene } from "@/components/DogLionScene";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-amber-100 via-white to-orange-100 px-6 py-20 text-neutral-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-orange-200/40 via-transparent to-transparent blur-2xl" />
      <div className="pointer-events-none absolute inset-y-12 left-40 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-y-24 right-40 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      <main className="z-10 flex w-full max-w-6xl flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-orange-700 shadow-sm">
            Courageous Canine Chronicles
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-orange-900 sm:text-5xl">
            The Day A Dog Made A Lion Run
          </h1>
          <p className="max-w-2xl text-lg text-orange-900/80 sm:text-xl">
            Watch a fearless pup unleash a mighty bark, startling the jungle&apos;s
            king and sending him sprinting into the sunset.
          </p>
        </div>
        <DogLionScene />
      </main>
    </div>
  );
}
