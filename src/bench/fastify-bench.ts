import autocannon from "autocannon";
import fs from "node:fs/promises";
import path from "node:path";

// --- Configuration ---
const TARGET_URL = "http://localhost:3001/create-user"; // Change to your Fastify URL
const root = process.cwd(); // where your command was run
const OUT_DIR = path.join(root, "benchmarks/fastify");
const DURATION = 30; // seconds
const CONNECTIONS = [200]; // The concurrency levels to test
const WORKERS = 4;

function generateTextReport(result: Record<string, any>) {
  return `
Benchmark Results for: ${result.url}
------------------------------------------------
Duration: ${result.duration}s
Connections: ${result.connections}
Date: ${new Date().toISOString()}

Stat         2.5%    50%    97.5%    99%    Avg     Stdev    Max
Latency      ${result.latency.p2_5}     ${result.latency.p50}    ${
    result.latency.p97_5
  }    ${result.latency.p99}    ${result.latency.average}   ${
    result.latency.stddev
  }   ${result.latency.max}
Req/Sec      ${result.requests.p2_5}     ${result.requests.p50}    ${
    result.requests.p97_5
  }    ${result.requests.p99}    ${result.requests.average}   ${
    result.requests.stddev
  }   ${result.requests.max}
Bytes/Sec    ${result.throughput.p2_5}     ${result.throughput.p50}    ${
    result.throughput.p97_5
  }    ${result.throughput.p99}    ${result.throughput.average}   ${
    result.throughput.stddev
  }   ${result.throughput.max}

Total Requests: ${result.requests.total}
Total Errors:   ${result.errors}
Timeouts:       ${result.timeouts}
------------------------------------------------
`;
}

// --- Helper: Run Single Benchmark ---
function runBenchmark(connections: number) {
  return new Promise((resolve, reject) => {
    console.log(
      `\n[Running] Concurrency: ${connections} | Duration: ${DURATION}s`
    );

    const instance = autocannon(
      {
        url: TARGET_URL,
        connections: connections,
        duration: DURATION,
        workers: WORKERS,
        // Add headers or body here if needed:
        // method: 'POST',
        // headers: { 'content-type': 'application/json' },
        // body: JSON.stringify({ ... })
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    // Attach the visual progress bar to the console
    autocannon.track(instance, { renderProgressBar: true });
  });
}

// --- Main Execution Loop ---
async function runAll() {
  console.log(`Starting Benchmarks... Saving to: ${OUT_DIR}`);

  for (const conn of CONNECTIONS) {
    try {
      // 1. Run Autocannon
      const result = (await runBenchmark(conn)) as Record<string, any>;

      // 2. Prepare File Paths
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filenameBase = `bench_c${conn}_d${DURATION}_${timestamp}`;
      const jsonPath = path.join(OUT_DIR, `${filenameBase}.json`);
      const txtPath = path.join(OUT_DIR, `${filenameBase}.txt`);

      // Creates folder if not exits
      await fs.mkdir(OUT_DIR, { recursive: true });

      // 3. Save JSON
      fs.writeFile(jsonPath, JSON.stringify(result, null, 2));

      // 4. Save Text Report
      const textReport = generateTextReport(result);
      fs.writeFile(txtPath, textReport);

      console.log(`✔ Saved JSON: ${path.basename(jsonPath)}`);
      console.log(`✔ Saved TXT:  ${path.basename(txtPath)}`);
    } catch (error) {
      console.error(
        `❌ Error running benchmark for connections=${conn}:`,
        error
      );
    }
  }

  console.log("\nAll benchmarks complete!");
}

runAll();
