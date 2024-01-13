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
  priority?: string | undefined;
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


  pushTask: protectedProcedure
  .input(z.object({ userId: z.string(), task: z.string(), status: z.string(), priority: z.string(), created: z.string() }))
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
    updated: z.string() 
  }))
  .mutation(async ({ input }) => {
    const task: UpdateTaskInput = await db.task.update({
      where: { id: input.id },
      data: {
        status: input.status,
        updated: input.updated,
      },
    });
    return task;
  }),

  updatePriority: protectedProcedure
  .input(z.object({ 
    id: z.string(), 
    priority: z.string(),
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

  pullAllTasks: protectedProcedure
  .query(async () => {
  const result = await db.task.findMany({
  select: {
    id: true,
    task: true, 
    status: true,
    priority: true,
    begin: true,
    due: true,
    user: {
      select: {
        id: true,
        name: true, 
        image: true
      }
    }
  }
})
  return result;
}),

});

export type PostRouter = typeof postRouter;