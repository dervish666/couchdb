# CouchDB on Cloudflare Workers

This project provides a Cloudflare Worker that allows you to run CouchDB functionality on Cloudflare's edge network.

## Current Implementation

The current implementation is a simple proxy to a CouchDB instance. It forwards requests from the Cloudflare Worker to a CouchDB server and returns the responses.

## Future Development

The goal is to implement more CouchDB functionality directly in the Worker, using Cloudflare's storage options:
- KV for small metadata and configuration
- Durable Objects for state management and coordination
- R2 for document storage

## Setup and Deployment

### Prerequisites

- Node.js and npm installed
- A Cloudflare account
- A running CouchDB instance (for the proxy implementation)

### Quick Start

We provide several scripts to make setup and deployment easier:

1. Initialize the project:

```bash
cd worker
./init.sh
```

This script will:
- Install dependencies
- Prompt for your CouchDB URL and update the configuration

2. Test the worker locally:

```bash
./test.sh
```

3. Deploy to Cloudflare:

```bash
./deploy.sh
```

### Manual Configuration

If you prefer to set up manually:

1. Install dependencies: `npm install`
2. Update the `COUCHDB_URL` in `wrangler.toml` to point to your CouchDB instance
3. Login to Cloudflare with Wrangler: `wrangler login`
4. Run locally: `npm run dev`
5. Deploy: `npm run deploy`

## Usage

Once deployed, you can interact with the CouchDB Worker using the same HTTP API as CouchDB:

```
https://couchdb-worker.<your-subdomain>.workers.dev/dbname/docid
```

## Limitations

- The current implementation requires an existing CouchDB instance
- Not all CouchDB features are supported natively yet
- Performance may vary depending on the location of your CouchDB instance