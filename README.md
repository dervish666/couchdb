# CouchDB on Cloudflare Workers

This project provides a Cloudflare Worker that allows you to run CouchDB functionality on Cloudflare's edge network.

## Current Implementation

The current implementation is a simple proxy to a CouchDB instance. It forwards requests from the Cloudflare Worker to a CouchDB server and returns the responses.

## Setup and Deployment

### Prerequisites

- Node.js and npm installed
- A Cloudflare account
- A running CouchDB instance (for the proxy implementation)

### Quick Start

1. Install dependencies:

```bash
npm install
```

2. Update the CouchDB URL in `wrangler.toml`:

```toml
[vars]
COUCHDB_URL = "https://your-couchdb-instance:5984"
```

3. Login to Cloudflare with Wrangler:

```bash
npx wrangler login
```

4. Deploy to Cloudflare:

```bash
npm run deploy
```

Or directly:

```bash
npx wrangler deploy
```

### Development

To run the worker locally:

```bash
npm run dev
```

Or directly:

```bash
npx wrangler dev
```

## Usage

Once deployed, you can interact with the CouchDB Worker using the same HTTP API as CouchDB:

```
https://couchdb-worker.<your-subdomain>.workers.dev/dbname/docid
```

## Future Development

The goal is to implement more CouchDB functionality directly in the Worker, using Cloudflare's storage options:
- KV for small metadata and configuration
- Durable Objects for state management and coordination
- R2 for document storage

See the `worker/IMPLEMENTATION_PLAN.md` file for a detailed roadmap.

## Limitations

- The current implementation requires an existing CouchDB instance
- Not all CouchDB features are supported natively yet
- Performance may vary depending on the location of your CouchDB instance