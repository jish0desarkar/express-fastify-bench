import autocannon from "autocannon";
import fs from "node:fs/promises";
import path from "node:path";

export function generateTextReport(result: autocannon.Result): string {
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
        Bytes/Sec    ${result.throughput.p2_5}     ${
    result.throughput.p50
  }    ${result.throughput.p97_5}    ${result.throughput.p99}    ${
    result.throughput.average
  }   ${result.throughput.stddev}   ${result.throughput.max}

        Total Requests: ${result.requests.total}
        Total 2xx Responses: ${result["2xx"]}
        Total non2xx Reponses:   ${result.non2xx}
        Timeouts:       ${result.timeouts}
        ------------------------------------------------
        `;
}

export function runBenchmark(
  connections: number,
  DURATION: number,
  TARGET_URL: string,
  WORKERS: number
): Promise<autocannon.Result> {
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
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    autocannon.track(instance, { renderProgressBar: true });
  });
}

export async function runAll(
  CONNECTIONS: number[],
  DURATION: number,
  TARGET_URL: string,
  WORKERS: number,
  OUT_DIR: string
): Promise<void> {
  console.log(`Starting Benchmarks... Saving to: ${OUT_DIR}`);

  for (const conn of CONNECTIONS) {
    try {
      const result: Awaited<ReturnType<typeof runBenchmark>> =
        await runBenchmark(conn, DURATION, TARGET_URL, WORKERS);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filenameBase = `bench_c${conn}_d${DURATION}_${timestamp}`;
      const jsonPath = path.join(OUT_DIR, `${filenameBase}.json`);
      const txtPath = path.join(OUT_DIR, `${filenameBase}.txt`);

      // Creates folder if not exits
      await fs.mkdir(OUT_DIR, { recursive: true });

      fs.writeFile(jsonPath, JSON.stringify(result, null, 2));

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
