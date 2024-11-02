import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import { createTRPCContext, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { transactions } from "~/server/db/schema";

const createTransactionSchema = z.object({
  assetId: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
});

type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const transactionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.transactions.findMany({
      orderBy: (transactions, { desc }) => [desc(transactions.transactionDate)],
      with: {
        asset: true,
        sender: true,
        receiver: true,
      },
    });
  }),

  create: publicProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }: {
      ctx: inferAsyncReturnType<typeof createTRPCContext>;
      input: CreateTransactionInput;
    }) => {
      return await ctx.db.insert(transactions).values({
        ...input,
        id: crypto.randomUUID(),
      });
    }),

  getByAssetId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.transactions.findMany({
        where: (transactions, { eq }) => eq(transactions.assetId, input),
        orderBy: (transactions, { desc }) => [desc(transactions.transactionDate)],
        with: {
          sender: true,
          receiver: true,
        },
      });
    }),
});