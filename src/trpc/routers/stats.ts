import { getGlobalStats } from "@/db/queries";
import { baseProcedure, createTRPCRouter } from "../init";

export const statsRouter = createTRPCRouter({
  global: baseProcedure.query(() => getGlobalStats()),
});
