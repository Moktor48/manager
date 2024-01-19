import { z } from "zod";
import { db } from "~/server/db";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type UpdateTaskInput = {
  id: string;
  task?: string | undefined;
  status?: string | undefined;
  priority?: number | undefined;
}

export const postRouter = createTRPCRouter({

  userList: protectedProcedure
    .query(async () => {
      const users = await db.user.findMany();
      return users;
    }),

  user: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const user = await db.user.findUnique({
      where: { id: input.id },
    });
    return user;
  }),

  // Excludes completed tasks from search on specific user's tasks
  userTask: protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const task = await db.task.findMany({
      where: { 
        userId: input.userId,
        status: { not: "Completed" },
       },
    });
    return task;
  }),

  megaUserTask: protectedProcedure
  .query(async () => {
    const task = await db.task.findMany({
    });
    return task;
  }),

  // Includes completed task from search on specific user's tasks
  fullUserTask: protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const task = await db.task.findMany({
      where: { 
        userId: input.userId
       },
    });
    return task;
  }),

  unassignedTask: protectedProcedure
  .query(async () => {
    const task = await db.task.findMany({
      where: { 
        userId: "Unassigned",
        status: { not: "Completed" },
       },
    });
    return task;
  }),

  fullUnassignedTask: protectedProcedure

  .query(async () => {
    const task = await db.task.findMany({
      where: { 
        userId: "Unassigned",
       },
    });
    return task;
  }),

  pushTask: protectedProcedure
  .input(z.object({ userId: z.string(), task: z.string(), status: z.string(), priority: z.number(), created: z.string() }))
  .mutation(async ({ input }) => {
    const task = await db.task.create({
      data: {
        userId: input.userId,
        task: input.task,
        status: input.status,
        priority: input.priority,
        created: input.created,
      },
    });
    return task;
  }),

  deleteTask: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const task = await db.task.delete({
      where: { id: input.id },
    });
    return task;
  }),

  updateEntry: protectedProcedure
  .input(z.object({
    id: z.string(),
    userId: z.string(),
    task: z.string(),
    status: z.string(),
    priority: z.number(),
    updated: z.string(),
  }))
  .mutation(async ({ input }) => {
    const update = await db.task.update({
      where: { id: input.id },
      data: {
        userId: input.userId,
        task: input.task,
        status: input.status,
        priority: input.priority,
        updated: input.updated,
      },
    });
    return update;
  }),

  updateTask: protectedProcedure
  .input(z.object({ 
    id: z.string(), 
    task: z.string(),
    updated: z.string()
  }))
  .mutation(async ({ input }) => {
    const task: UpdateTaskInput = await db.task.update({
      where: { id: input.id },
      data: {
        task: input.task,
        updated: input.updated,
      },
    });
    return task;
  }),

  updateStatus: protectedProcedure
  .input(z.object({ 
    id: z.string(), 
    status: z.string(),
    updated: z.string(),
    userId: z.string()
  }))
  .mutation(async ({ input }) => {
    const task: UpdateTaskInput = await db.task.update({
      where: { id: input.id },
      data: {
        userId: input.userId,
        status: input.status,
        updated: input.updated,
      },
    });
    return task;
  }),

  updatePriority: protectedProcedure
  .input(z.object({ 
    id: z.string(), 
    priority: z.number(),
    updated: z.string()
  }))
  .mutation(async ({ input }) => {
    const task: UpdateTaskInput = await db.task.update({
      where: { id: input.id },
      data: {
        priority: input.priority,
        updated: input.updated,
      },
    });
    return task;
  }),

});

export type PostRouter = typeof postRouter;