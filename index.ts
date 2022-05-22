import * as duckdb from '@duckdb/duckdb-wasm/dist/duckdb-browser-blocking';

(global as any).location = {};

const DUCKDB_BUNDLES = duckdb.getJsDelivrBundles();

let globalDB: duckdb.DuckDBBindings | null = null;
let globalDBPromise: Promise<duckdb.DuckDBBindings> | null = null;
async function instantiate() {
    const logger = new duckdb.ConsoleLogger();
    const db = await duckdb.createDuckDB(DUCKDB_BUNDLES, logger, duckdb.DEFAULT_RUNTIME);
    await db.instantiate((progress) => {});
    globalDB = db;
    return db;
}
async function instantiateOnce(): Promise<duckdb.DuckDBBindings> {
    if (globalDB != null) return globalDB;
    if (globalDBPromise != null) return await globalDBPromise;
    globalDBPromise = instantiate();
    return await globalDBPromise;
}

async function handleRequest(request: any) {
    const db = await instantiateOnce();
    return new Response(db.getVersion(), {
        headers: { 'content-type': 'text/plain' },
    });
}

addEventListener('fetch', (event: any) => {
  return event.respondWith(handleRequest(event.request));
});