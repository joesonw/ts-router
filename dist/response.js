"use strict";
const util_1 = require('./util');
class Response {
    constructor(body, status, headers) {
        this.body = body;
        this.status = status;
        this.headers = headers;
    }
    static status(status) {
        let ret = new ResponseBuilder();
        ret.status(status);
        return ret;
    }
    send(context) {
        context.body = this.body;
        context.status = this.status;
        for (const key in this.headers) {
            context.set(key, this.headers[key]);
        }
    }
}
(function (Response) {
    (function (Status) {
        Status[Status["ACCEPTED"] = 202] = "ACCEPTED";
        Status[Status["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
        Status[Status["BAD_REQUEST"] = 400] = "BAD_REQUEST";
        Status[Status["CONFLICT"] = 409] = "CONFLICT";
        Status[Status["CREATED"] = 201] = "CREATED";
        Status[Status["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
        Status[Status["FORBIDDEN"] = 403] = "FORBIDDEN";
        Status[Status["FOUND"] = 302] = "FOUND";
        Status[Status["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
        Status[Status["GONE"] = 410] = "GONE";
        Status[Status["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
        Status[Status["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
        Status[Status["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
        Status[Status["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
        Status[Status["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
        Status[Status["NO_CONTENT"] = 204] = "NO_CONTENT";
        Status[Status["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
        Status[Status["NOT_FOUND"] = 404] = "NOT_FOUND";
        Status[Status["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
        Status[Status["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
        Status[Status["OK"] = 200] = "OK";
        Status[Status["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
        Status[Status["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
        Status[Status["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
        Status[Status["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
        Status[Status["REQUEST_ENTITY_TOO_LARGE"] = 413] = "REQUEST_ENTITY_TOO_LARGE";
        Status[Status["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
        Status[Status["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
        Status[Status["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
        Status[Status["RESET_CONTENT"] = 205] = "RESET_CONTENT";
        Status[Status["SEE_OTHER"] = 303] = "SEE_OTHER";
        Status[Status["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
        Status[Status["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
        Status[Status["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
        Status[Status["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
        Status[Status["USE_PROXY"] = 305] = "USE_PROXY";
    })(Response.Status || (Response.Status = {}));
    var Status = Response.Status;
    ;
})(Response || (Response = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Response;
class ResponseBuilder {
    constructor() {
        this._status = 404;
        this._headers = {};
        this._body = '';
        this._charset = null;
        this._allow = [];
    }
    status(status) {
        this._status = status;
        return this;
    }
    header(key, value) {
        this._headers[key] = value;
        return this;
    }
    type(type) {
        if (typeof (type) === 'string') {
            this._type = type;
        }
        else {
            this._type = util_1.mediaTypeToString(type);
        }
        return this;
    }
    body(body) {
        this._body = body;
        return this;
    }
    allow(...methods) {
        for (let method of methods) {
            let v = method;
            if (typeof method === 'number') {
                switch (method) {
                    case util_1.HttpMethod.GET:
                        v = 'GET';
                        break;
                    case util_1.HttpMethod.POST:
                        v = 'POST';
                        break;
                    case util_1.HttpMethod.PUT:
                        v = 'PUT';
                        break;
                    case util_1.HttpMethod.DELETE:
                        v = 'DELETE';
                        break;
                }
            }
            this._allow.push(v);
        }
        return this;
    }
    charset(charset) {
        if (typeof charset === 'number') {
            switch (charset) {
                case util_1.Charset.UTF8:
                    this._charset = 'utf-8';
                    break;
            }
        }
        else {
            this._charset = charset;
        }
        return this;
    }
    expires(date) {
        this._headers['Cache-Control'] = date.toUTCString();
        return this;
    }
    lastModified(date) {
        this._headers['Last-Modified'] = date.toUTCString();
        return this;
    }
    cookie(cookie) {
        this._headers['Set-Cookie'] = cookie.toString();
        return this;
    }
    build() {
        let body = this._body;
        let status = this._status;
        let headers = this._headers;
        let contentType = this._type;
        if (this._charset) {
            contentType += '; charset=' + this._charset;
        }
        if (contentType) {
            headers['Content-Type'] = contentType;
        }
        if (this._allow.length > 0) {
            headers['Allow'] = this._allow.join(',');
        }
        let ret = new Response(body, status, headers);
        return ret;
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=response.js.map