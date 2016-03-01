// Type definitions for ts-router 0.1.1
// Project: https://github.com/joesonw/ts-router
// Definitions by: Qiaosen Huang <https://github.com/joesonw>
/// <reference path="../koa/koa.d.ts"/>


declare module 'ts-router'{
    import * as Koa from 'koa';
    export class Controller {
        __routes:{ [key:string]: {
            method?:    string;
            filter?:    'after' | 'before';
            path?:      string;
            produce?:   MediaType;
            consume?:   MediaType;
            parameters?: {
                index: number;
                type: Function;
                key: string;
                paramType: string;
            }[];
        }};
        __properties: { [key:string] : {
            key: string;
            paramType: string;
        }};
        __path:string;
    }
    export class Router {
        routes(): (context: Koa.IContext, next:Promise<void>) => Promise<void>;
        use<T extends Controller>(RouterClass: new(...args) => T);
    }
    export class ResponseBuilder {
        status(status: number | Response.Status):ResponseBuilder;
        header(key:string, value:string):ResponseBuilder;
        type(type: MediaType):ResponseBuilder;
        body(body: any):ResponseBuilder;
        allow(...methods: (string | HttpMethod)[]):ResponseBuilder;
        charset(charset: Charset | string):ResponseBuilder;
        expires(date: Date):ResponseBuilder;
        lastModified(date: Date):ResponseBuilder;
        cookie(cookie:Cookie):ResponseBuilder;
        build(): Response;
    }
    export class Response {
        static status(status: number | Response.Status):ResponseBuilder;
        body: any;
        status: number;
        headers: { [key:string] : string};
        constructor(body:string, status:number, headers: { [key:string] : string});
        send(context: Context);
    }
    export namespace Response {
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
        }
    }
    export function Before(target:Controller, key:string);
    export function After(target:Controller, key:string);
    export function GET(target:Controller, key:string);
    export function POST(target:Controller, key:string);
    export function PUT(target:Controller, key:string);
    export function DELETE(target:Controller, key:string);
    export function Path(path:string):(target:Controller | (new () => Controller), key?:string) => void;
    export function Produce(type: MediaType):(target:Controller, key:string) => void;
    export function Consume(type: MediaType):(target:Controller, key:string) => void;
    export function QueryParam(param: string):(target:Controller, key:string, index:number) => void;
    export function PathParam(param: string):(target:Controller, key:string, index?:number) => void;
    export function BodyParam(param:string):(target:Controller, key:string, index?:number) => void;
    export function HeaderParam(param:string): (target:Controller, key:string, index?:number) => void;
    export function Query(target:Controller, key:string, index?:number);
    export function Params(target:Controller, key:string, index?:number);
    export function Body(target:Controller, key:string, index?:number);
    export function Headers(target:Controller, key:string, index?:number);
    export function AppContext(target:Controller, key:string, index?:number);
    export function HttpContext(target:Controller, key:string, index?:number);
    export function RouteResponse(target:Controller, key:string, index:number);

    export enum MediaType {
        TEXT,
        JSON,
        FORM
    }
    export enum HttpMethod {
        GET,
        POST,
        PUT,
        DELETE
    }
    export enum Charset {
        UTF8
    }
    export function mediaTypeToString(type: MediaType):string;
    export interface Context extends Koa.IContext{
        cookie?: Cookie;
        params?: Object;
        requestBody?: any;
    }
    export class ReflectType {
        static TYPE:string;
        static PARAMETER_TYPE:string;
        static RETURN_TYPE:string;
    }
    export class Cookie {
        content: string;
        path: string;
        secure: boolean;
        httpOnly: boolean;
        expires: Date;
        maxAge: number;
        toString():string;
    }
    export interface Context extends Koa.IContext{
        cookie?: Cookie;
        params?: Object;
        requestBody?: any;
    }
}
