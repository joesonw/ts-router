import Cookie from './cookie';
import * as Koa from 'koa';

interface Context extends Koa.Context{
    cookie?: Cookie;
    params?: Object;
    requestBody?: any;
}
export default Context;
