import * as net from "net";
import fs from "node:fs";
import * as process from 'process';
import { HTML_STATUS, ROUTES } from "./consts";
import { arrayToObject } from "./utils";

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString();  
        const [requestLine, ...restOfheaders] = data.toString().split("\r\n");
        const [body] = restOfheaders.splice(restOfheaders.length - 1);
        const [method, path] = requestLine.split(" ");
        const [root, pathRoute, content, ...restParameters] = path.split('/');
        console.log("requestLine: ", requestLine)
        const headers = arrayToObject(restOfheaders)
        console.log("body: ", body)
        console.log("method: ", method)
        console.log("path: ", path)
        console.log("root: ", root)
        console.log("restParameters: ", restParameters)
        console.log("content: ", content)

        switch (pathRoute) {

            case ROUTES.ROOT: {
                socket.write(HTML_STATUS.OK)
                socket.end();
                break
            }
            case ROUTES.ECHO: {
                if(headers["Accept-Encoding"] === "gzip"){
                    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Encoding: gzip\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
                    socket.end();
                }
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
                socket.end();
                break
            }

            case ROUTES.USER_AGENT: {
                const userAgent = request.split('User-Agent: ')[1].split('\r\n')[0]
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
                socket.end();
                break
            }

            case ROUTES.FILES: {
                const directory: string = process.argv[3];
                try {
                    if(method === 'GET') {
                        const fileContent = fs.readFileSync(directory + content);
                        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
                        socket.end();
                    } else {
                        fs.writeFileSync(directory + content, body);
                        socket.write(HTML_STATUS.CREATED)
                        socket.end();

                    }
                } catch (e) {
                    socket.write(HTML_STATUS.NOT_FOUND)
                    socket.end();
                }
                break
            }
            default: {
                socket.write(HTML_STATUS.NOT_FOUND)
                socket.end();
                break
            }
        }

    })
});

server.listen(4221, "localhost");
