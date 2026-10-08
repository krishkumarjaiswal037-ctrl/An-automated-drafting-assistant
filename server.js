const { createReadStream, statSync } = require("node:fs");
const { createServer } = require("node:http");
const path = require("node:path");

const projectRoot = __dirname;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function resolveRequestPath(requestUrl) {
  const pathname = new URL(requestUrl, "http://localhost").pathname;
  const decodedPath = decodeURIComponent(pathname);

  if (decodedPath.split("/").some((segment) => segment.startsWith(".") && segment.length > 1)) {
    return null;
  }

  if (decodedPath === "/") {
    return path.join(projectRoot, "index.html");
  }

  if (decodedPath === "/manus-routes.json") {
    return path.join(projectRoot, "public", "manus-routes.json");
  }

  const resolvedPath = path.resolve(projectRoot, `.${decodedPath}`);
  if (!resolvedPath.startsWith(`${projectRoot}${path.sep}`)) {
    return null;
  }

  return resolvedPath;
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let filePath;
  try {
    filePath = resolveRequestPath(request.url ?? "/");
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  if (!filePath) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  try {
    if (!statSync(filePath).isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
  } catch {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[path.extname(filePath)] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`Drafting assistant website listening on 0.0.0.0:${port}`);
});
