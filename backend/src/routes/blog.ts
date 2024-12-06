import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    jwtPayload: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("jwtPayload", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "Not logged in",
      });
    }
  } catch (error) {
    c.status(403);
    return c.json({
      message: "Not logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const authorId = c.get("jwtPayload");

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
      },
    });

    return c.json({
      message: "Blog created successfully.",
      id: blog.id,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "An unexpected error occurred while creating the blog post.",
    });
  }
});

blogRouter.get("/blog", (c) => {
  return c.text("Created blogs");
});

blogRouter.put("/blog", (c) => {
  return c.text("update blog");
});
