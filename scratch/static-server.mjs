import http from "http";
import fs from "fs";
import path from "path";

const PORT = 3000;
const OUT_DIR = path.resolve("./out");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  let targetPath = path.join(OUT_DIR, pathname);

  // If path is a directory or ends with /, check index.html
  if (pathname.endsWith("/")) {
    targetPath = path.join(OUT_DIR, pathname, "index.html");
  } else if (!path.extname(pathname)) {
    // Check if pathname.html exists
    if (fs.existsSync(targetPath + ".html")) {
      targetPath = targetPath + ".html";
    } else if (fs.existsSync(path.join(targetPath, "index.html"))) {
      targetPath = path.join(targetPath, "index.html");
    }
  }

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "X-DNS-Prefetch-Control": "on",
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff"
    });
    fs.createReadStream(targetPath).pipe(res);
  } else {
    // 404
    const err404 = path.join(OUT_DIR, "404.html");
    if (fs.existsSync(err404)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(err404).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }
});

server.listen(PORT, () => {
  console.log(`Static Cloudflare-Pages-Simulation server listening on http://localhost:${PORT}`);
});
