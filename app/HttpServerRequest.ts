import fs from "node:fs";
import * as process from 'process';
import { HTML_STATUS, ROUTES } from "./consts";
import { gzipSync } from "zlib";
import { arrayToObject } from "./utils"

export class HttpServerRequest {
    private headers: Record<string, string>
    private body: string
    private method: string
    private pathRoute: string
    private content: string
    private encoding: string
    private response: string

    constructor(request: string) {
        const [requestLine, ...restOfheaders] = request.split("\r\n");
        const [body] = restOfheaders.splice(restOfheaders.length - 1);
        const [method, path] = requestLine.split(" ");
        const [root, pathRoute, content, ...restParameters] = path.split('/');

        this.headers = arrayToObject(restOfheaders)
        this.body = body
        this.method = method
        this.pathRoute = pathRoute
        this.content = content
        this.encoding = this.headers['Accept-Encoding'].includes('gzip') ? 'gzip' : ''
        this.response = `HTTP/1.1 200 OK\r\n`

    }

    responseBuilder = {
        withContentType: (type: string) => {
            this.response + `Content-Type: ${type}\r\n`
            return this.responseBuilder
        },
        withContentLength: (length: number) => {
            this.response + `Content-Length: ${length}\r\n\r\n`
            return this.responseBuilder
        },
        withContent: (content: Buffer | string) => {
            this.response + content
            return this.responseBuilder
        },
        withEncoding: () => {
            this.response + `Content-Encoding: ${this.encoding}\r\n`
            return this.responseBuilder
        },
        flush: () => {
            const responseMessage = this.response
            this.response = `HTTP/1.1 200 OK\r\n`
            return responseMessage
        }
    }

    // Read and write from or to file system
    private read(path: string) {
        const fileContent = fs.readFileSync(path);
        const response = this.responseBuilder
            .withContentType('text/plain')
            .withContentLength(fileContent.length)
            .withContent(fileContent)
            .flush()
        return response
    }

    private write(path: string, content: string) {
        fs.writeFileSync(path, content);
        return HTML_STATUS.CREATED
    }

    handleFileSystem() {
        const directory: string = process.argv[3];
        const path = directory + this.content
        try {
            if (this.method === 'GET') {
                return this.read(path)
            } else if (this.method === 'POST') {
                return this.write(path, this.body)
            }
        } catch (e) {
            console.error(e)
        }
        return HTML_STATUS.NOT_FOUND
    }

    getUserAgent() {
        const userAgent = this.headers['User-Agent']
        const response = this.responseBuilder
            .withContentType('text/plain')
            .withContentLength(userAgent.length)
            .withContent(userAgent)
            .flush()
        return response
    }

    echo() {

        if (this.encoding === 'gzip') {
            const buffer = Buffer.from(this.content, 'utf8');
            const encodedBody = gzipSync(buffer)
            const response = this.responseBuilder
                .withEncoding()
                .withContentType('text/plain')
                .withContentLength(encodedBody.length)
                .flush()
            return { response, encodedBody }
        }
        const response = this.responseBuilder
            .withContentType('text/plain')
            .withContentLength(this.content.length)
            .withContent(this.content)
            .flush()
        return { response, encodedBody: undefined }
    }

    getRoutPath() {
        return this.pathRoute
    }
}