/// <reference path="../typings/koa/koa.d.ts"/>
/// <reference path="../typings/path-to-regexp/path-to-regexp.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>

import * as Koa from 'koa';
import * as pathToRegexp from 'path-to-regexp';
import * as  _ from 'lodash';
const parse:any = require('co-body');
import {parseMulti, MediaType, mediaTypeToString } from './util';
import Controller from './controller';
import Response from './response';
import Context from './context';






class Router {
    private _routes:{
        method: string;
        path: string[];
        produce: MediaType;
        consume: MediaType;
        pathKeys: pathToRegexp.Key[][];
        pathReg: RegExp[];
        filter: string;
        route: string;
        routerClass: new (...args) => Controller;
        parameters: {
            index: number;
            type: Function;
            key: string;
            paramType: string;
        }[];
    }[] = [];

    constructor() {
    }

    routes(): (ctx:Koa.IContext, next:Promise<void>) => Promise<void> {
        let self = this;
        return async function (context:Koa.IContext, next:Promise<void>):Promise<void> {
            let matchedRoute;
            let params = {};
            let afters = [];
            let befores = [];
            //  Find match routes
            for (let route of self._routes) {
                if (route.filter === 'before') {
                    befores.push(route);
                } else if (route.filter === 'after') {
                    afters.push(route);
                } else {
                    if (route.method === context.method) {
                        for (let i = 0; i < route.pathReg.length; i++) {
                            let reg = route.pathReg[i];
                            let ret = reg.exec(context.path);
                            if (ret) {
                                matchedRoute = route;
                                for (let j = 0; j < route.pathKeys[i].length; j++) {
                                    params[route.pathKeys[i][j].name] = ret[j + 1];
                                }
                                break;
                            }
                        }
                    }
                }
            }

            if (matchedRoute) {
                let parameters = [];
                let body = {};


                //parse body
                if (matchedRoute.consume === MediaType.JSON &&
                    context.headers['content-type'] === mediaTypeToString(MediaType.JSON)) {
                    body = await new Promise((resolve, reject) => {
                        parse.json(context).then(resolve).catch(reject);
                    });
                } else if (matchedRoute.consume === MediaType.FORM &&
                    context.headers['content-type'] === mediaTypeToString(MediaType.FORM)) {
                    body = await new Promise((resolve, reject) => {
                        parse.form(context).then(resolve).catch(reject);
                    });
                } else if (matchedRoute.consume === MediaType.TEXT &&
                    context.headers['content-type'] === mediaTypeToString(MediaType.TEXT)) {
                    body = await new Promise((resolve, reject) => {
                        parse.text(context).then(resolve).catch(reject);
                    });
                } else if (matchedRoute.consume === MediaType.MULTIPART &&
                    (context.headers['content-type'] || '').substr(0, 19) === mediaTypeToString(MediaType.MULTIPART)) {
                    let result = await parseMulti(context);
                    body = {};
                    for (let key in result.fields) {
                        body[key] = result.fields[key];
                    }
                    for (let key in result.files) {
                        body[key] = result.files[key];
                    }
                }
                let appContext:Context  = context;
                appContext.requestBody  = body;
                appContext.params       = params;


                let response:Response;
                function getParameter(parameter) {
                    let ret;
                    switch (parameter.paramType) {
                        case 'query-param':
                            ret = _.get(context.query, parameter.key);
                            break;
                        case 'path-param':
                            ret = _.get(params, parameter.key);
                            break;
                        case 'body-param':
                            ret = _.get(body, parameter.key);
                            break;
                        case 'header-param':
                            ret = _.get(context.headers, parameter.key);
                            break;
                        case 'query':
                            ret = context.query;
                            break;
                        case 'params':
                            ret = params;
                            break;
                        case 'body':
                            ret = body;
                            break;
                        case 'headers':
                            ret = context.headers;
                            break;
                        case 'app-context':
                            ret = appContext
                            break;
                        case 'http-context':
                            ret = context;
                            break;
                        case 'response':
                            ret = response;
                            break;
                    }
                    if ([Object, String, Date, Number, Boolean].indexOf(parameter.type) !== -1) {
                        return parameter.type(ret);
                    } else if ([Response].indexOf(parameter.type) !== -1) {
                        return ret;
                    } else {
                        return new parameter.type(ret);
                    }
                }

                for (let parameter of matchedRoute.parameters || []) {
                    parameters.push(getParameter(parameter));
                }
                let klass = matchedRoute.routerClass;
                for (let key in klass.prototype.__properties || []) {
                    klass.prototype[key] = getParameter(klass.prototype.__properties[key]);
                }

                let router = new klass();

                for (let before of befores) {
                    let p = [];
                    for (let parameter of before.parameters || []) {
                        p.push(getParameter(parameter));
                    }
                    await router[before.route](...p);
                }
                response = await router[matchedRoute.route](...parameters);

                if (matchedRoute.produce) {
                    response.headers['Content-Type'] = mediaTypeToString(matchedRoute.produce);
                }
                switch (matchedRoute.produce) {
                    case MediaType.JSON:
                        response.body = JSON.stringify(response.body);
                        break;
                }

                response.send(appContext);

                for (let after of afters) {
                    let p = [];
                    for (let parameter of after.parameters || []) {
                        p.push(getParameter(parameter));
                    }
                    await router[after.route](...p);
                }
                await next;
                router = null;
                klass = null;
                response = null;
                parameters = null;
                body = null;
            }
        };
    }

    use<T extends Controller>(RouterClass: new (...args) => T) {
        let router = RouterClass.prototype;
        for (let key in router.__routes) {
            let route = router.__routes[key];

            let pathReg = [];
            let pathKeys = [];
            for (let path of route.path || []) {
                let keys:pathToRegexp.Key[] = [];
                let reg = pathToRegexp(router.__path + path, keys);
                pathReg.push(reg);
                pathKeys.push(keys);
            }
            this._routes.push({
                routerClass: RouterClass,
                method: route.method,
                path: (route.path || []).map(p => router.__path + p),
                produce: route.produce,
                consume: route.consume,
                filter: route.filter,
                route: key,
                pathReg: pathReg,
                pathKeys: pathKeys,
                parameters: route.parameters
            });
        }
    }
}

export default Router;
