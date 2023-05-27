import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getUserByEmail: privateProcedure
    .input(
      z.object({
        userEmail: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.userEmail },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Couldn't find an user with that email",
        });
      }

      return user;
    }),
});
