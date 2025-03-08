# CouchDB Worker Usage Examples

This document provides examples of how to interact with the CouchDB Worker using curl commands.

## Basic Operations

### Check if the Worker is running

```bash
curl https://couchdb-worker.<your-subdomain>.workers.dev/
```

Expected response:
```json
{
  "couchdb": "Welcome",
  "version": "CouchDB Worker 0.1.0",
  "cloudflare_worker": true
}
```

### Create a database

```bash
curl -X PUT https://couchdb-worker.<your-subdomain>.workers.dev/mydb
```

Expected response:
```json
{
  "ok": true
}
```

### List all databases

```bash
curl https://couchdb-worker.<your-subdomain>.workers.dev/_all_dbs
```

Expected response:
```json
["mydb"]
```

## Document Operations

### Create a document

```bash
curl -X POST https://couchdb-worker.<your-subdomain>.workers.dev/mydb \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

Expected response:
```json
{
  "ok": true,
  "id": "abc123",
  "rev": "1-xyz456"
}
```

### Create a document with a specific ID

```bash
curl -X PUT https://couchdb-worker.<your-subdomain>.workers.dev/mydb/doc1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
```

Expected response:
```json
{
  "ok": true,
  "id": "doc1",
  "rev": "1-abc123"
}
```

### Retrieve a document

```bash
curl https://couchdb-worker.<your-subdomain>.workers.dev/mydb/doc1
```

Expected response:
```json
{
  "_id": "doc1",
  "_rev": "1-abc123",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Update a document

```bash
curl -X PUT https://couchdb-worker.<your-subdomain>.workers.dev/mydb/doc1 \
  -H "Content-Type: application/json" \
  -d '{"_rev": "1-abc123", "name": "Jane Smith", "email": "jane@example.com"}'
```

Expected response:
```json
{
  "ok": true,
  "id": "doc1",
  "rev": "2-def456"
}
```

### Delete a document

```bash
curl -X DELETE https://couchdb-worker.<your-subdomain>.workers.dev/mydb/doc1?rev=2-def456
```

Expected response:
```json
{
  "ok": true,
  "id": "doc1",
  "rev": "3-ghi789"
}
```

## Bulk Operations

### Bulk insert documents

```bash
curl -X POST https://couchdb-worker.<your-subdomain>.workers.dev/mydb/_bulk_docs \
  -H "Content-Type: application/json" \
  -d '{
    "docs": [
      {"name": "Alice", "age": 25},
      {"name": "Bob", "age": 30},
      {"name": "Charlie", "age": 35}
    ]
  }'
```

## Querying

### Create a view

```bash
curl -X PUT https://couchdb-worker.<your-subdomain>.workers.dev/mydb/_design/users \
  -H "Content-Type: application/json" \
  -d '{
    "views": {
      "by_name": {
        "map": "function(doc) { emit(doc.name, null); }"
      }
    }
  }'
```

### Query a view

```bash
curl https://couchdb-worker.<your-subdomain>.workers.dev/mydb/_design/users/_view/by_name
```

## Note

These examples assume the CouchDB Worker is fully implemented with all features. The current proxy implementation will forward these requests to your actual CouchDB instance.