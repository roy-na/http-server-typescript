import * as net from "net";
import { HTML_STATUS, ROUTES } from "./consts";

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString();
        const path = request.split(' ')[1];
        const params = path.split('/')[1];

        switch (params) {

            case ROUTES.ECHO: {
                const message = path.split('/')[2]
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`)
                socket.end();
                break
            }

            case ROUTES.USER_AGENT: {
                const userAgent = request.split('User-Agent: ')[1].split('\r\n')[0]
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
                socket.end();
                break
            }

            default: {
                if (request === ROUTES.ROOT) {
                    socket.write(HTML_STATUS.OK)
                    socket.end();
                    break
                } else {
                    socket.write(HTML_STATUS.NOT_FOUND)
                    socket.end();
                    break
                }
            }
        }

    })
});

server.listen(4221, "localhost");
