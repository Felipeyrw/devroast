import { createTRPCRouter } from "../init";
import { roastRouter } from "./roast";
import { statsRouter } from "./stats";

export const appRouter = createTRPCRouter({
  roast: roastRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
