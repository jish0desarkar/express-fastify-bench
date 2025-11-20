import Fastify from "fastify";
import { prisma } from "../database-connection.js";

const fastify = Fastify({
  logger: false,
});

fastify.get(
  "/create-user",
  {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            user: { id: { type: "string" }, name: { type: "string" } },
          },
        },
      },
    },
  },
  async (req, reply) => {
    const user = await prisma.user.create({
      data: {
        name: "Jishnu",
      },
    });
    reply.send({ user });
  }
);

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    fastify.close();
  }
  fastify.log.info("Server listening at " + address);
});
