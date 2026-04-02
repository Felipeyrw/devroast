import Link from "next/link";
import { connection } from "next/server";

export default async function NotFound() {
  await connection();

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-mono text-4xl font-bold text-text-primary">404</h1>
        <p className="font-mono text-sm text-text-secondary">
          {"//"} page not found
        </p>
        <Link
          href="/"
          className="cursor-pointer border border-border-primary px-4 py-2 font-mono text-xs text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
        >
          go_home {"<<"}
        </Link>
      </div>
    </main>
  );
}
