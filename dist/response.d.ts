import Cookie from './cookie';
import { Charset, HttpMethod, MediaType } from './util';
import Context from './context';
declare class Response {
    static status(status: number | Response.Status): ResponseBuilder;
    body: any;
    status: number;
    headers: {
        [key: string]: string;
    };
    constructor(body: string, status: number, headers: {
        [key: string]: string;
    });
    send(context: Context): void;
}
declare namespace Response {
    enum Status {
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
        USE_PROXY = 305,
    }
}
export default Response;
export declare class ResponseBuilder {
    private _status;
    private _headers;
    private _body;
    private _type;
    private _charset;
    private _allow;
    status(status: number | Response.Status): ResponseBuilder;
    header(key: string, value: string): ResponseBuilder;
    type(type: MediaType): ResponseBuilder;
    body(body: any): ResponseBuilder;
    allow(...methods: (string | HttpMethod)[]): ResponseBuilder;
    charset(charset: Charset | string): ResponseBuilder;
    expires(date: Date): ResponseBuilder;
    lastModified(date: Date): ResponseBuilder;
    cookie(cookie: Cookie): ResponseBuilder;
    build(): Response;
}
