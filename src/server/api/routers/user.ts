import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { type inferAsyncReturnType } from "@trpc/server";
import { type createTRPCContext } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

const createUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  image: z.string().optional(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.email)],
    });
  }),

  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }: {
      ctx: inferAsyncReturnType<typeof createTRPCContext>;
      input: CreateUserInput;
    }) => {
      return await ctx.db.insert(users).values({
        ...input,
        id: crypto.randomUUID(),
      });
    }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input),
      });
    }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    
    return await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });
  }),
});