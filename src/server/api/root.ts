// import { postRouter } from "~/server/api/routers/post";
// import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

// /**
//  * This is the primary router for your server.
//  *
//  * All routers added in /api/routers should be manually added here.
//  */
// export const appRouter = createTRPCRouter({
//   post: postRouter,
// });

// // export type definition of API
// export type AppRouter = typeof appRouter;

// /**
//  * Create a server-side caller for the tRPC API.
//  * @example
//  * const trpc = createCaller(createContext);
//  * const res = await trpc.post.all();
//  *       ^? Post[]
//  */
// export const createCaller = createCallerFactory(appRouter);


import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { assetRouter } from "./routers/asset";
import { userRouter } from "./routers/user";
import { transactionRouter } from "./routers/transaction";

export const appRouter = createTRPCRouter({
  asset: assetRouter,
  user: userRouter,
  transaction: transactionRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.asset.all();
 */
export const createCaller = createCallerFactory(appRouter);