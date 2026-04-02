import { z } from "zod";
import { getLeaderboardCached } from "@/db/queries";
import { baseProcedure, createTRPCRouter } from "../init";

export const roastRouter = createTRPCRouter({
  leaderboard: baseProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(3),
      }),
    )
    .query(({ input }) => getLeaderboardCached(input.limit)),
});
