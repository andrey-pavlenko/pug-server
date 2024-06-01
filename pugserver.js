#!/usr/bin/env node
const { program } = require('commander')
const http = require('http')
const fs = require('fs')
const path = require('path')
const pug = require('pug')
const staticfiles = require('node-static')

program
  .description('Basic .pug file server')
  .argument('[string]', 'path', '.')
  .option('-p, --port <number>', 'run your server on port', '8080')
  .action(startServer)
program.parse()

function startServer (pugPath, { port }) {
  const fileServer = new staticfiles.Server(pugPath || '.')
  try {
    http.createServer((req, res) => {
      console.info(req.method, req.url)

      const requrl = req.url.match(/\/$/) ? `${req.url}index` : req.url

      if (fs.existsSync(path.join(pugPath, `${requrl}.pug`))) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(pug.renderFile(path.join(pugPath, `${requrl}.pug`)))
      } else {
        req.addListener('end', () => { fileServer.serve(req, res) }).resume()
      }
    }).listen(port)
    console.log(`Open your browser to http://localhost:${port}/`)
  } catch (e) {
    throw new Error(e)
  }
}
