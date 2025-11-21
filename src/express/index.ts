import express, { Request, Response } from "express";
import { mockResponse } from "../common/mock-response.js";

const app = express();

app.use(express.json());

// To match headers sent by fastify
app.disable("x-powered-by");
app.set("etag", false);

app.get("/mock-response", async (req, res) => {
  res.send({ mockResponse });
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
