import express, { Request, Response } from "express";
import { prisma } from "../database-connection.js";

const app = express();

app.use(express.json());

// To match headers sent by fastify
app.disable("x-powered-by");
app.set("etag", false);

app.get("/create-user", async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      name: "Jishnu",
    },
  });
  res.send({ user });
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
