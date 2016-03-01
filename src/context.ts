import Cookie from './cookie';
/// <reference path="../typings/koa/koa.d.ts"/>
import * as Koa from 'koa';

interface Context extends Koa.IContext{
    cookie?: Cookie;
    params?: Object;
    requestBody?: any;
}
export default Context;
