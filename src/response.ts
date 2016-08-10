import * as Koa from 'koa';
import Cookie from './cookie';
import {Charset, HttpMethod, MediaType, mediaTypeToString} from './util';
import Context from './context';


class Response {
    static status(status: number | Response.Status):ResponseBuilder {
        let ret = new ResponseBuilder();
        ret.status(status);
        return ret;
    }
    body: any;
    status: number;
    headers: { [key:string] : string};
    constructor(body:string, status:number, headers: { [key:string] : string}) {
        this.body = body;
        this.status = status;
        this.headers = headers;
    }
    send(context: Context) {
        context.body = this.body;
        context.status = this.status;
        for (let key in this.headers) {
            context.set(key, this.headers[key]);
        }
    }
}

namespace Response {
    export enum Status {
        ACCEPTED = 202,
        BAD_GATEWAY = 502,
        BAD_REQUEST = 400,
        CONFLICT = 409,
        CREATED = 201,
        EXPECTATION_FAILED = 417,
        FORBIDDEN = 403,
        FOUND = 302,
        GATEWAY_TIMEOUT = 504,
        GONE = 410,
        HTTP_VERSION_NOT_SUPPORTED = 505,
        INTERNAL_SERVER_ERROR = 500,
        LENGTH_REQUIRED = 411,
        METHOD_NOT_ALLOWED = 405,
        MOVED_PERMANENTLY = 301,
        NO_CONTENT = 204,
        NOT_ACCEPTABLE = 406,
        NOT_FOUND = 404,
        NOT_IMPLEMENTED = 501,
        NOT_MODIFIED = 304,
        OK = 200,
        PARTIAL_CONTENT = 206,
        PAYMENT_REQUIRED = 402,
        PRECONDITION_FAILED = 412,
        PROXY_AUTHENTICATION_REQUIRED = 407,
        REQUEST_ENTITY_TOO_LARGE = 413,
        REQUEST_TIMEOUT = 408,
        REQUEST_URI_TOO_LONG = 414,
        REQUESTED_RANGE_NOT_SATISFIABLE = 416,
        RESET_CONTENT = 205,
        SEE_OTHER = 303,
        SERVICE_UNAVAILABLE = 503,
        TEMPORARY_REDIRECT = 307,
        UNAUTHORIZED = 401,
        UNSUPPORTED_MEDIA_TYPE = 415,
        USE_PROXY = 305
    };
}

export default Response;

export class ResponseBuilder {
    private _status: number = 404;
    private _headers: { [key:string] : string} = {};
    private _body: any = ''
    private _type: string = 'text/plain';
    private _charset: string = null;
    private _allow: string[] = [];

    status(status: number | Response.Status):ResponseBuilder {
        this._status = status;
        return this;
    }
    header(key:string, value:string):ResponseBuilder {
        this._headers[key] = value;
        return this;
    }
    type(type: MediaType | string):ResponseBuilder {
        if (typeof(type) === 'string') {
            this._type = type;
        } else {
            this._type = mediaTypeToString(type);
        }
        return this;
    }
    body(body: any):ResponseBuilder {
        this._body = body;
        return this;
    }
    allow(...methods: (string | HttpMethod)[]):ResponseBuilder {
        for (let method of methods) {
            let v:string = method as string;
            if (typeof method === 'number') {
                switch (method as HttpMethod) {
                    case HttpMethod.GET:
                        v = 'GET';
                        break;
                    case HttpMethod.POST:
                        v = 'POST';
                        break;
                    case HttpMethod.PUT:
                        v = 'PUT';
                        break;
                    case HttpMethod.DELETE:
                        v = 'DELETE';
                        break;
                }
            }
            this._allow.push(v);
        }
        return this;
    }
    charset(charset: Charset | string):ResponseBuilder {
        if (typeof charset === 'number') {
            switch (charset as Charset) {
                case Charset.UTF8:
                    this._charset = 'utf-8';
                    break;
            }
        } else {
            this._charset = charset;
        }
        return this;
    }
    expires(date: Date):ResponseBuilder {
        this._headers['Cache-Control'] = date.toUTCString();
        return this;
    }
    lastModified(date: Date):ResponseBuilder {
        this._headers['Last-Modified'] = date.toUTCString();
        return this;
    }
    cookie(cookie:Cookie):ResponseBuilder {
        this._headers['Set-Cookie'] = cookie.toString();
        return this;
    }
    build(): Response {
        let body                = this._body;
        let status              = this._status;
        let headers             = this._headers;
        let contentType         = this._type;
        if (this._charset) {
            contentType         += '; charset=' + this._charset
        }
        headers['Content-Type'] = contentType;
        headers['Allow']        = this._allow.join(',');
        let ret = new Response(body, status, headers);
        return ret;
    }
}
