import path from "node:path";
import { runAll } from "../common/bench-utils.js";

const TARGET_URL = "http://localhost:3000/mock-response"; // Change to your Fastify URL
const root = process.cwd(); // where your command was run
const OUT_DIR = path.join(root, "benchmarks/express");
const DURATION = 10; // seconds
const CONNECTIONS = [200]; // The concurrency levels to test
const WORKERS = 4;

runAll(CONNECTIONS, DURATION, TARGET_URL, WORKERS, OUT_DIR);
