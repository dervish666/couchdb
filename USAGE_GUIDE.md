# CouchDB Worker Usage Guide

Your CouchDB Worker is now deployed at: https://couchdb.brisflix.workers.dev

This guide will help you test the basic functionality of the worker using curl commands.

## Basic Operations

### Check if the Worker is running

```bash
curl https://couchdb.brisflix.workers.dev/
```

Expected response:
```json
{
  "couchdb": "Welcome",
  "version": "CouchDB Worker 0.1.0",
  "cloudflare_worker": true
}
```

### List all databases

```bash
curl https://couchdb.brisflix.workers.dev/_all_dbs
```

Expected response (initially empty):
```json
[]
```

## Database Operations

### Create a database

```bash
curl -X PUT https://couchdb.brisflix.workers.dev/mydb
```

Expected response:
```json
{
  "ok": true
}
```

### Get database info

```bash
curl https://couchdb.brisflix.workers.dev/mydb
```

Expected response:
```json
{
  "db_name": "mydb",
  "doc_count": 0,
  "update_seq": 0
}
```

### Delete a database

```bash
curl -X DELETE https://couchdb.brisflix.workers.dev/mydb
```

Expected response:
```json
{
  "ok": true
}
```

## Document Operations

### Create a document with a specific ID

```bash
# First, create a database
curl -X PUT https://couchdb.brisflix.workers.dev/mydb

# Then create a document
curl -X PUT https://couchdb.brisflix.workers.dev/mydb/doc1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

Expected response:
```json
{
  "ok": true,
  "id": "doc1",
  "rev": "1-[some hash]"
}
```

### Retrieve a document

```bash
curl https://couchdb.brisflix.workers.dev/mydb/doc1
```

Expected response:
```json
{
  "_id": "doc1",
  "_rev": "1-[some hash]",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Delete a document

```bash
curl -X DELETE https://couchdb.brisflix.workers.dev/mydb/doc1
```

Expected response:
```json
{
  "ok": true,
  "id": "doc1",
  "rev": "2-[some hash]"
}
```

## Important Notes

1. **In-Memory Storage**: The current implementation uses in-memory storage, which means all data will be lost when the worker is restarted or updated. This is just for demonstration purposes.

2. **Limited Functionality**: This is a basic implementation that simulates some CouchDB functionality. Many features like views, attachments, and replication are not implemented yet.

3. **Browser Testing**: You can also test the API by visiting the URLs in your browser. For example, visit https://couchdb.brisflix.workers.dev/ to see the welcome message.

## Next Steps

To make this a more complete CouchDB implementation, we would need to:

1. Implement persistent storage using Cloudflare's KV, Durable Objects, or R2
2. Add support for views and queries
3. Implement proper document revision handling
4. Add authentication and authorization
5. Implement replication protocol