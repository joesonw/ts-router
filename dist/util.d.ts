/// <reference types="koa" />
import Cookie from './cookie';
import * as Koa from 'koa';
export declare enum MediaType {
    TEXT = 0,
    JSON = 1,
    FORM = 2,
    MULTIPART = 3,
}
export declare enum HttpMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
}
export declare enum Charset {
    UTF8 = 0,
}
export declare function mediaTypeToString(type: MediaType): string;
export interface Context extends Koa.Context {
    cookie: Cookie;
}
import 'reflect-metadata';
export declare class ReflectType {
    static TYPE: string;
    static PARAMETER_TYPE: string;
    static RETURN_TYPE: string;
}
export declare function parseMulti(ctx: Koa.Context, opts?: any): Promise<any>;
