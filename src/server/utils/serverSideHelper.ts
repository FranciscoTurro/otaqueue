import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../api/root";
import { prisma } from "../db";
import superjson from "superjson";

export const generateServerSideHelper = () =>
  createServerSideHelpers({
    //helper functions that can prefetch queries on the server. calls procedures directly on the server, without an HTTP request
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
