
import * as Koa from 'koa';
import Cookie from './cookie';

interface Context extends Koa.Context{
    [key: string]: any;
    cookie?: Cookie;
    params?: Object;
    requestBody?: any;
}
export default Context;
