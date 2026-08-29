import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <Image
        src="/logos/oms-logo.png"
        alt="ORYXI Maintenance Services"
        width={913}
        height={600}
        className="h-auto w-64 max-w-full"
        priority
      />
      <h1 className="text-xl font-semibold text-oms-burgundy">
        ORYXI Maintenance Services
      </h1>
      <p className="text-oms-dark">Website under development</p>
    </main>
  );
}
