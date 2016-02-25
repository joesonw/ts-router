import Cookie from './cookie';
/// <reference path="../typings/koa/koa.d.ts"/>
import * as Koa from 'koa';
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
export function mediaTypeToString(type: MediaType):string {
    switch (type) {
        case MediaType.TEXT:
            return 'text/plain';
        case MediaType.JSON:
            return 'application/json';
        case MediaType.FORM:
            return 'application/x-www-form-urlencoded';
    }
    return 'text/plain';
}
export interface Context extends Koa.IContext{
    cookie: Cookie;
}

/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
import 'reflect-metadata';
export class ReflectType {
    static TYPE:string = 'design:type';
    static PARAMETER_TYPE:string = 'design:paramtypes';
    static RETURN_TYPE:string = 'design:returntype';
}
