import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId,
      },
    });

    return c.json({
      message: "Blog created",
      id: blog.id,
    });
  } catch (error) {
    c.status(403);
    return c.json({
      message: "Post not created",
    });
  }
});

blogRouter.get("/blog", (c) => {
  return c.text("Created blogs");
});

blogRouter.put("/blog", (c) => {
  return c.text("update blog");
});
