// ~/server/api/routers/asset.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type inferAsyncReturnType } from "@trpc/server";
import { type createTRPCContext } from "~/server/api/trpc";
import { assets } from "~/server/db/schema";
import { eq } from "drizzle-orm";

type CreateInput = z.infer<typeof createAssetSchema>;
type TransferInput = z.infer<typeof transferAssetSchema>;

const createAssetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  ownerId: z.string().uuid(),
});

const transferAssetSchema = z.object({
  assetId: z.string().uuid(),
  newOwnerId: z.string().uuid(),
});

export const assetRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.assets.findMany({
      orderBy: (assets, { desc }) => [desc(assets.createdAt)],
    });
  }),

  create: publicProcedure
    .input(createAssetSchema)
    .mutation(async ({ ctx, input }: { 
      ctx: inferAsyncReturnType<typeof createTRPCContext>;
      input: CreateInput;
    }) => {
      return await ctx.db.insert(assets).values(input);
    }),

  transfer: publicProcedure
    .input(transferAssetSchema)
    .mutation(async ({ ctx, input }: {
      ctx: inferAsyncReturnType<typeof createTRPCContext>;
      input: TransferInput;
    }) => {
      const asset = await ctx.db
        .update(assets)
        .set({ ownerId: input.newOwnerId })
        .where(eq(assets.id, input.assetId))
        .returning();
      return asset[0];
    }),
});