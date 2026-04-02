import { initTRPC } from "@trpc/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return { headers: opts.headers };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const loggedProcedure = baseProcedure.use(async (opts) => {
  const start = Date.now();
  const result = await opts.next();
  const durationMs = Date.now() - start;
  const meta = { path: opts.path, type: opts.type, durationMs };
  if (result.ok) {
    console.log("OK request timing:", meta);
  } else {
    console.error("Non-OK request timing:", meta);
  }
  return result;
});
