import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const jwt = sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      message: "User created successfully.",
      jwt,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "An unexpected error occurred.",
    });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "User not found. Please sign up.",
      });
    }

    const jwt = sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      message: "Signed in successfully.",
      jwt,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "An unexpected error occurred.",
    });
  }
});
