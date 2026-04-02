import { z } from "zod";
import { getLeaderboard } from "@/db/queries";
import { baseProcedure, createTRPCRouter } from "../init";

export const roastRouter = createTRPCRouter({
  leaderboard: baseProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(10).default(3),
      }),
    )
    .query(({ input }) => getLeaderboard(input.limit)),
});
