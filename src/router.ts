/// <reference path="../typings/koa/koa.d.ts"/>
/// <reference path="../typings/path-to-regexp/path-to-regexp.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>

import * as Koa from 'koa';
import * as pathToRegexp from 'path-to-regexp';
import * as  _ from 'lodash';
const parse:any = require('co-body');
import {MediaType, mediaTypeToString } from './util';
import Controller from './controller';
import Response from './response';






class Router {
    private _routes:{
        method: string;
        path: string;
        produce: MediaType;
        consume: MediaType;
        pathKeys: pathToRegexp.Key[];
        pathReg: RegExp;
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
            for (let route of self._routes) {
                if (route.filter === 'before') {
                    befores.push(route);
                } else if (route.filter === 'after') {
                    afters.push(route);
                } else {
                    if (route.method === context.method) {
                        let ret = route.pathReg.exec(context.path);
                        if (ret) {
                            matchedRoute = route;
                            for (let i = 0; i < route.pathKeys.length; i++) {
                                params[route.pathKeys[0].name] = ret[i + 1];
                            }
                            break;
                        }
                    }
                }
            }

            if (matchedRoute) {
                let parameters = [];
                let body = {};

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
                }


                function getParameter(parameter) {
                    switch (parameter.paramType) {
                        case 'query-param':
                            return _.get(context.query, parameter.key);
                        case 'path-param':
                            return _.get(params, parameter.key);
                        case 'body-param':
                            return _.get(body, parameter.key);
                        case 'header-param':
                            return _.get(context.headers, parameter.key);
                        case 'query':
                            return context.query;
                        case 'params':
                            return params;
                        case 'body':
                            return body;
                        case 'headers':
                            return context.headers;
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
                let response:Response = await router[matchedRoute.route](...parameters);

                if (matchedRoute.produce) {
                    response.headers['Content-Type'] = mediaTypeToString(matchedRoute.produce);
                }
                switch (matchedRoute.produce) {
                    case MediaType.JSON:
                        response.body = JSON.stringify(response.body);
                        break;
                }

                await next;

                response.send(context);
                for (let after of afters) {
                    let p = [];
                    for (let parameter of after.parameters || []) {
                        p.push(getParameter(parameter));
                    }
                    await router[after.route](...p);
                }
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
            let keys:pathToRegexp.Key[] = [];
            let pathReg = pathToRegexp(router.__path + route.path, keys);
            let pathKeys = keys;
            for (let parameter of route.parameters || []) {
                if (parameter.paramType === 'path-param') {
                    let ret = _.find(pathKeys, {name: parameter.key});
                }
            }
            this._routes.push({
                routerClass: RouterClass,
                method: route.method,
                path: router.__path + route.path,
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
