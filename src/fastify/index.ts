import Fastify from "fastify";
import { mockResponse } from "../common/mock-response.js";

const fastify = Fastify({
  logger: false,
});

const mockResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    version: { type: "string" },
    runtime: {
      type: "object",
      properties: {
        cpu: { type: "string" },
        cores: { type: "number" },
        threads: { type: "number" },
      },
    },
    memory: {
      type: "object",
      properties: {
        total: { type: "string" },
        used: { type: "string" },
        free: { type: "string" },
      },
    },
    disk: {
      type: "object",
      properties: {
        total: { type: "string" },
        used: { type: "string" },
        free: { type: "string" },
      },
    },
    network: {
      type: "object",
      properties: {
        downloadMbps: { type: "number" },
        uploadMbps: { type: "number" },
        latencyMs: { type: "number" },
      },
    },
    ui: {
      type: "object",
      properties: {
        width: { type: "number" },
        height: { type: "number" },
        density: { type: "string" },
      },
    },
    geo: {
      type: "object",
      properties: {
        lat: { type: "number" },
        lng: { type: "number" },
        accuracy: { type: "number" },
      },
    },
    cache: {
      type: "object",
      properties: {
        hits: { type: "number" },
        misses: { type: "number" },
        strategy: { type: "string" },
      },
    },
    jobs: {
      type: "object",
      properties: {
        queued: { type: "number" },
        processing: { type: "number" },
        failed: { type: "number" },
      },
    },
    payments: {
      type: "object",
      properties: {
        provider: { type: "string" },
        currency: { type: "string" },
        retry: { type: "boolean" },
      },
    },
    notifications: {
      type: "object",
      properties: {
        email: { type: "boolean" },
        sms: { type: "boolean" },
        push: { type: "boolean" },
      },
    },
    limits: {
      type: "object",
      properties: {
        maxRequestsPerMinute: { type: "number" },
        maxConnections: { type: "number" },
        maxPayloadMb: { type: "number" },
      },
    },
  },
};

fastify.get("/mock-response-no-schema", async (req, reply) => {
  reply.send({ mockResponse });
});
fastify.get(
  "/mock-response-with-schema",
  {
    schema: {
      response: {
        201: mockResponseSchema,
      },
    },
  },
  async (req, reply) => {
    reply.code(201).send(mockResponse);
  }
);

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    fastify.close();
  }
  fastify.log.info("Server listening at " + address);
});
