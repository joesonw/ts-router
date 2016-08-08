/// <reference types="koa" />
import * as Koa from 'koa';
import Controller from './controller';
declare class Router {
    private _routes;
    constructor();
    routes(): (ctx: Koa.Context, next: Function) => Promise<void>;
    use<T extends Controller>(RouterClass: new (...args) => T): void;
}
export default Router;
