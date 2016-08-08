"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pathToRegexp = require('path-to-regexp');
const _ = require('lodash');
const parse = require('co-body');
const util_1 = require('./util');
const response_1 = require('./response');
const symbols_1 = require('./symbols');
class Router {
    constructor() {
        this._routes = [];
    }
    routes() {
        let self = this;
        return function (context, next) {
            return __awaiter(this, void 0, void 0, function* () {
                let matchedRoute;
                let params = {};
                let afters = [];
                let befores = [];
                //  Find match routes
                for (let route of self._routes) {
                    if (route.filter === 'before') {
                        befores.push(route);
                    }
                    else if (route.filter === 'after') {
                        afters.push(route);
                    }
                    else {
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
                    if (matchedRoute.consume === util_1.MediaType.JSON &&
                        context.headers['content-type'] === util_1.mediaTypeToString(util_1.MediaType.JSON)) {
                        body = yield new Promise((resolve, reject) => {
                            parse.json(context).then(resolve).catch(reject);
                        });
                    }
                    else if (matchedRoute.consume === util_1.MediaType.FORM &&
                        context.headers['content-type'] === util_1.mediaTypeToString(util_1.MediaType.FORM)) {
                        body = yield new Promise((resolve, reject) => {
                            parse.form(context).then(resolve).catch(reject);
                        });
                    }
                    else if (matchedRoute.consume === util_1.MediaType.TEXT &&
                        context.headers['content-type'] === util_1.mediaTypeToString(util_1.MediaType.TEXT)) {
                        body = yield new Promise((resolve, reject) => {
                            parse.text(context).then(resolve).catch(reject);
                        });
                    }
                    else if (matchedRoute.consume === util_1.MediaType.MULTIPART &&
                        (context.headers['content-type'] || '').substr(0, 19) === util_1.mediaTypeToString(util_1.MediaType.MULTIPART)) {
                        let result = yield util_1.parseMulti(context);
                        body = {};
                        for (let key in result.fields) {
                            body[key] = result.fields[key];
                        }
                        for (let key in result.files) {
                            body[key] = result.files[key];
                        }
                    }
                    let appContext = context;
                    appContext.requestBody = body;
                    appContext.params = params;
                    let response;
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
                                ret = appContext;
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
                        }
                        else if ([response_1.default].indexOf(parameter.type) !== -1) {
                            return ret;
                        }
                        else {
                            return new parameter.type(ret);
                        }
                    }
                    for (let parameter of matchedRoute.parameters || []) {
                        parameters.push(getParameter(parameter));
                    }
                    let klass = matchedRoute.routerClass;
                    for (let key in klass.prototype[symbols_1.Properties] || []) {
                        klass.prototype[key] = getParameter(klass.prototype[symbols_1.Properties][key]);
                    }
                    let router = new klass();
                    for (let before of befores) {
                        let p = [];
                        for (let parameter of before.parameters || []) {
                            p.push(getParameter(parameter));
                        }
                        yield router[before.route](...p);
                    }
                    const injections = matchedRoute.injection || [];
                    for (const injection of injections) {
                        yield injection(appContext);
                    }
                    response = yield router[matchedRoute.route](...parameters);
                    if (matchedRoute.produce) {
                        response.headers['Content-Type'] = util_1.mediaTypeToString(matchedRoute.produce);
                    }
                    switch (matchedRoute.produce) {
                        case util_1.MediaType.JSON:
                            response.body = JSON.stringify(response.body);
                            break;
                    }
                    response.send(appContext);
                    for (let after of afters) {
                        let p = [];
                        for (let parameter of after.parameters || []) {
                            p.push(getParameter(parameter));
                        }
                        yield router[after.route](...p);
                    }
                    yield next();
                    router = null;
                    klass = null;
                    response = null;
                    parameters = null;
                    body = null;
                }
            });
        };
    }
    use(RouterClass) {
        let router = RouterClass.prototype;
        for (let key in router[symbols_1.Routes]) {
            let route = router[symbols_1.Routes][key];
            let pathReg = [];
            let pathKeys = [];
            for (let path of route.path || []) {
                let keys = [];
                let reg = pathToRegexp(router[symbols_1.RoutePath] + path, keys);
                pathReg.push(reg);
                pathKeys.push(keys);
            }
            this._routes.push({
                routerClass: RouterClass,
                method: route.method,
                path: (route.path || []).map(p => router[symbols_1.RoutePath] + p),
                produce: route.produce,
                consume: route.consume,
                injection: route.injection,
                filter: route.filter,
                route: key,
                pathReg: pathReg,
                pathKeys: pathKeys,
                parameters: route.parameters
            });
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Router;
