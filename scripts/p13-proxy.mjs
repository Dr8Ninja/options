// Ephemeral HTTPS ingress for the P11 real-stack browser fixture only.
import https from "node:https";
import http from "node:http";
import fs from "node:fs";
const directory = process.env.P13_RUNTIME;
if (!directory) throw new Error("P13_RUNTIME required");
https.createServer({key:fs.readFileSync(`${directory}/key.pem`),cert:fs.readFileSync(`${directory}/cert.pem`)}, (req,res) => {
  const headers = {...req.headers};
  for(const name of ["authorization","x-user-id","x-user-roles","x-forwarded-host","forwarded"]) delete headers[name];
  const port=req.url.startsWith("/api/") ? 18084 : 3102;
  const upstream=http.request({hostname:"127.0.0.1",port,path:req.url,method:req.method,headers}, response=>{res.writeHead(response.statusCode,response.headers);response.pipe(res);});
  upstream.on("error",()=>{res.writeHead(503,{"Cache-Control":"no-store"});res.end("Temporarily unavailable");});
  req.pipe(upstream);
}).listen(18445,"127.0.0.1");
