/**
 * CouchDB Worker for Cloudflare
 * 
 * This worker implements basic CouchDB-like functionality directly in the Worker.
 */

// In-memory storage for demonstration purposes
// In a real implementation, you would use KV, Durable Objects, or R2
const databases = new Map();

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

/**
 * Helper function to create a JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders
  });
}

/**
 * Main fetch handler for the Worker
 */
export default {
  async fetch(request, env, ctx) {
    // Handle OPTIONS requests for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Parse the request URL
    const url = new URL(request.url);
    const path = url.pathname;
    
    try {
      // Root path - CouchDB welcome
      if (path === '/' || path === '') {
        return jsonResponse({
          couchdb: "Welcome",
          version: "CouchDB Worker 0.1.0",
          cloudflare_worker: true
        });
      }
      
      // List all databases
      if (path === '/_all_dbs') {
        return jsonResponse(Array.from(databases.keys()));
      }
      
      // Handle /_utils request (Fauxton UI in regular CouchDB)
      if (path === '/_utils' || path.startsWith('/_utils/')) {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>CouchDB Worker - Admin UI Not Available</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #333; }
              pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
              .note { background: #fffde7; padding: 15px; border-left: 5px solid #ffd54f; margin-bottom: 20px; }
              code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h1>CouchDB Worker - Admin UI</h1>
            <div class="note">
              <strong>Note:</strong> The Fauxton web UI is not available in this CouchDB Worker implementation.
              This is a lightweight implementation running on Cloudflare Workers that provides a CouchDB-compatible API
              but does not include the admin interface.
            </div>
            
            <h2>Available Endpoints</h2>
            <ul>
              <li><code>/</code> - Welcome message</li>
              <li><code>/_all_dbs</code> - List all databases</li>
              <li><code>/{db}</code> - Create/get/delete database</li>
              <li><code>/{db}/{doc}</code> - Create/get/update/delete document</li>
            </ul>
            
            <h2>Example Usage</h2>
            <p>You can interact with this CouchDB Worker using curl or any HTTP client:</p>
            <pre>
# Create a database
curl -X PUT https://couchdb.brisflix.workers.dev/mydb

# Create a document
curl -X PUT https://couchdb.brisflix.workers.dev/mydb/doc1 \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Retrieve a document
curl https://couchdb.brisflix.workers.dev/mydb/doc1
            </pre>
            
            <p>See the <a href="https://github.com/apache/couchdb/blob/main/README.rst">CouchDB documentation</a> for more information on the CouchDB API.</p>
          </body>
          </html>
        `, {
          headers: {
            'Content-Type': 'text/html'
          }
        });
      }
      
      // Database operations
      if (path.match(/^\/[^\/]+\/?$/)) {
        const dbName = path.replace(/^\/([^\/]+)\/?$/, '$1');
        
        // Create database
        if (request.method === 'PUT') {
          if (databases.has(dbName)) {
            return jsonResponse({ error: 'file_exists', reason: 'The database could not be created, the file already exists.' }, 412);
          }
          databases.set(dbName, new Map());
          return jsonResponse({ ok: true });
        }
        
        // Get database info
        if (request.method === 'GET') {
          if (!databases.has(dbName)) {
            return jsonResponse({ error: 'not_found', reason: 'Database does not exist.' }, 404);
          }
          const docCount = databases.get(dbName).size;
          return jsonResponse({
            db_name: dbName,
            doc_count: docCount,
            update_seq: docCount
          });
        }
        
        // Delete database
        if (request.method === 'DELETE') {
          if (!databases.has(dbName)) {
            return jsonResponse({ error: 'not_found', reason: 'Database does not exist.' }, 404);
          }
          databases.delete(dbName);
          return jsonResponse({ ok: true });
        }
      }
      
      // Document operations
      const docMatch = path.match(/^\/([^\/]+)\/([^\/]+)\/?$/);
      if (docMatch) {
        const [, dbName, docId] = docMatch;
        
        // Check if database exists
        if (!databases.has(dbName)) {
          return jsonResponse({ error: 'not_found', reason: 'Database does not exist.' }, 404);
        }
        
        const db = databases.get(dbName);
        
        // Get document
        if (request.method === 'GET') {
          if (!db.has(docId)) {
            return jsonResponse({ error: 'not_found', reason: 'Document does not exist.' }, 404);
          }
          return jsonResponse(db.get(docId));
        }
        
        // Create/update document
        if (request.method === 'PUT') {
          const body = await request.json();
          const doc = {
            _id: docId,
            _rev: `1-${Date.now().toString(16)}`,
            ...body
          };
          db.set(docId, doc);
          return jsonResponse({ ok: true, id: docId, rev: doc._rev });
        }
        
        // Delete document
        if (request.method === 'DELETE') {
          if (!db.has(docId)) {
            return jsonResponse({ error: 'not_found', reason: 'Document does not exist.' }, 404);
          }
          db.delete(docId);
          return jsonResponse({ ok: true, id: docId, rev: `2-${Date.now().toString(16)}` });
        }
      }
      
      // Default response for unhandled paths
      return jsonResponse({ error: 'not_implemented', reason: 'This endpoint is not implemented yet.' }, 501);
      
    } catch (error) {
      // Handle errors
      return jsonResponse({ 
        error: 'server_error', 
        reason: error.message 
      }, 500);
    }
  }
};