import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.post("/api/v1/signup", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  return c.text("Signup route");
});

app.post("/api/v1/signin", (c) => {
  return c.text("Signin route");
});

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  return c.text("Get blog route");
});

app.post("/api/v1/blog", (c) => {
  return c.text("Create blog");
});

app.put("/api/v1/blog", (c) => {
  return c.text("update blog");
});

export default app;
