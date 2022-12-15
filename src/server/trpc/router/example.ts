import { Post } from "@prisma/client";
import { string, z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

// (alias) type Post = {
//   id: number;
//   title: string;
//   intro: string;
//   content: string | null;
//   published: boolean;
// }
export const ZodPost = z.object({
  id: z.number(),
  title: z.string(),
  intro: z.string(),
  content: z.string().nullable(),
  publish: z.boolean(),
});
export const EditPostZodType = z.object({
  id: z.number(),
  title: z.string(),
  intro: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
});
export const ContactMeZodType = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
})

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getPost: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getPosts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  deletePost: protectedProcedure
    .input(z.number().int().positive())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.delete({
        where: { id: input },
      });
    }),
  editPost: protectedProcedure
    .input(EditPostZodType)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  contactMe: publicProcedure
    .input(ContactMeZodType)
    .mutation(async ({ ctx, input }) => {
      return "boi if u dont"
    }),
  // .input(z.object({ id: z.number().int().positive() }))
  // .mutation(async ({ ctx, input }) => {
  //   return await ctx.prisma.post.delete({
  //     where: {
  //       id: input.id,
  //     },
  //   });
  // }),
});
