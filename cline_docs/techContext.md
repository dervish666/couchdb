# Technical Context

## Technologies used
- **CouchDB**: Document-oriented NoSQL database (source codebase)
- **Cloudflare Workers**: Serverless JavaScript/TypeScript runtime environment
- **Wrangler**: CLI tool for developing and deploying Cloudflare Workers
- **JavaScript/TypeScript**: Primary programming languages for Cloudflare Workers
- **Cloudflare Storage Options**:
  - KV: Key-value store for small data
  - Durable Objects: For coordinated state management
  - R2: Object storage (similar to S3)

## Development setup
- Local CouchDB codebase (cloned from GitHub)
- Cloudflare Workers account
- Wrangler CLI for deployment
- Node.js development environment

## Technical constraints
1. **Runtime Limitations**:
   - Cloudflare Workers run in V8 isolates with specific memory and CPU limits
   - Maximum execution time of 30ms on free plans, up to 30s on paid plans
   - No direct file system access

2. **Storage Constraints**:
   - KV has size limits (2KB metadata, values up to 25MB)
   - R2 objects have a maximum size of 5TB
   - Storage operations are eventually consistent

3. **Network Constraints**:
   - Workers can make outbound HTTP requests but with limitations
   - No direct TCP/UDP socket access
   - Limited to Cloudflare's supported protocols

4. **State Management**:
   - Workers are primarily stateless; persistent state must use storage APIs
   - Durable Objects provide coordination but with different semantics than Erlang processes

5. **Language Differences**:
   - Need to translate Erlang/OTP concepts to JavaScript/TypeScript
   - Different concurrency models (Erlang processes vs. JavaScript async/await)