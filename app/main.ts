import * as net from "net";
import fs from "node:fs";
import * as process from 'process';
import { HTML_STATUS, ROUTES } from "./consts";
import { arrayToObject } from "./utils";
import { gzipSync } from "zlib";
import { HttpServerRequest } from "./HttpServerRequest";


const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const httpServerRequest = new HttpServerRequest(data.toString())
        switch (httpServerRequest.getRoutPath()) {
            case ROUTES.ROOT: {
                socket.write(HTML_STATUS.OK)
                socket.end();
                break
            }
            case ROUTES.ECHO: {
                const { response, encodedBody } = httpServerRequest.echo()
                socket.write(response)
                if (encodedBody) {
                    socket.write(encodedBody)
                }
                socket.end();
                break
            }

            case ROUTES.USER_AGENT: {
                socket.write(httpServerRequest.getUserAgent())
                socket.end();
                break
            }

            case ROUTES.FILES: {

                socket.write(httpServerRequest.handleFileSystem())
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
