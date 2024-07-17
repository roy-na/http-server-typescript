import * as net from "net";
import fs from "node:fs";
import * as process from 'process';
import { HTML_STATUS, ROUTES } from "./consts";

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString(); // Full request 
        const path = request.split(' ')[1]; // Request path
        const params = path.split('/')[1]; // Params sent after the path
        const requestContent = path.split('/')[2]

        switch (params) {

            case ROUTES.ROOT: {
                socket.write(HTML_STATUS.OK)
                socket.end();
                break
            }
            case ROUTES.ECHO: {
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${requestContent.length}\r\n\r\n${requestContent}`)
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
                const content = fs.readFileSync("." + directory + requestContent);

                if (!content) {
                    socket.write(HTML_STATUS.NOT_FOUND)
                    socket.end();
                }

                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
                socket.end();
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
