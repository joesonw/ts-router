import Controller from './controller';
import {ReflectType, MediaType } from './util';
import Context from './context';
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
import 'reflect-metadata';

export function Before(target:Controller, key:string) {
    target.__routes                 = target.__routes || {};
    target.__routes[key]            = target.__routes[key] || {};
    target.__routes[key].filter     = 'before';
}
export function After(target:Controller, key:string) {
    target.__routes                 = target.__routes || {};
    target.__routes[key]            = target.__routes[key] || {};
    target.__routes[key].filter     = 'after';
}
export function GET(target:Controller, key:string) {
    target.__routes                 = target.__routes || {};
    target.__routes[key]            = target.__routes[key] || {};
    target.__routes[key].method     = 'GET';
}
export function POST(target:Controller, key:string) {
    target.__routes                 = target.__routes || {};
    target.__routes[key]            = target.__routes[key] || {};
    target.__routes[key].method     = 'POST';
}
export function PUT(target:Controller, key:string) {
    target.__routes                 = target.__routes || {};
    target.__routes[key]            = target.__routes[key] || {};
    target.__routes[key].method     = 'PUT';
}
export function DELETE(target:Controller, key:string) {
    target.__routes                 = target.__routes || {};
    target.__routes[key]            = target.__routes[key] || {};
    target.__routes[key].method     = 'DELETE';
}
export function Path(path:string) {
    return (target:Controller | (new () => Controller), key?:string) => {
        if (key) {
            let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key);
            (target as Controller).__routes  = (target as Controller).__routes || {};
            (target as Controller).__routes[key] = (target as Controller).__routes[key] || {};
            (target as Controller).__routes[key].path = (target as Controller).__routes[key].path || [];
            (target as Controller).__routes[key].path.push(path);
        } else {
            Object.defineProperty((target as (new () => Controller)).prototype, '__path', {
                value: path
            });
        }
    }
}
export function Produce(type: MediaType) {
    return (target:Controller, key:string) => {
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].produce = type;
    }
}
export function Consume(type: MediaType) {
    return (target:Controller, key:string) => {
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].consume = type;
    }
}
export function QueryParam(param: string) {
    return (target:Controller, key:string, index?:number) => {
        if (index !== undefined) {
            let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
            target.__routes             = target.__routes || {};
            target.__routes[key]        = target.__routes[key] || {};
            target.__routes[key].parameters =  target.__routes[key].parameters || [];
            target.__routes[key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'query-param'
            };
        } else {
            target.__properties =  target.__properties || {};
            target.__properties[key] = {
                key: param,
                type: Reflect.getMetadata(ReflectType.TYPE, target, key),
                paramType: 'query-param'
            };
        }
    };
}
export function PathParam(param: string) {
    return (target:Controller, key:string, index?:number) => {
        if (index !== undefined) {
            let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
            target.__routes             = target.__routes || {};
            target.__routes[key]        = target.__routes[key] || {};
            target.__routes[key].parameters =  target.__routes[key].parameters || [];
            target.__routes[key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'path-param'
            };
        } else {
            target.__properties =  target.__properties || {};
            target.__properties[key] = {
                key: param,
                type: Reflect.getMetadata(ReflectType.TYPE, target, key),
                paramType: 'path-param'
            };
        }
    }
}
export function BodyParam(param:string) {
    return (target:Controller, key:string, index?:number) => {
        if (index !== undefined) {
            let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
            target.__routes             = target.__routes || {};
            target.__routes[key]        = target.__routes[key] || {};
            target.__routes[key].parameters =  target.__routes[key].parameters || [];
            target.__routes[key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'body-param'
            };
        } else {
            target.__properties =  target.__properties || {};
            target.__properties[key] = {
                key: param,
                type: Reflect.getMetadata(ReflectType.TYPE, target, key),
                paramType: 'body-param'
            };
        }
    }
}
export function HeaderParam(param:string) {
    return (target:Controller, key:string, index?:number) => {
        if (index !== undefined) {
            let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
            target.__routes             = target.__routes || {};
            target.__routes[key]        = target.__routes[key] || {};
            target.__routes[key].parameters =  target.__routes[key].parameters || [];
            target.__routes[key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'header-param'
            };
        } else {
            target.__properties =  target.__properties || {};
            target.__properties[key] = {
                key: param,
                type: Reflect.getMetadata(ReflectType.TYPE, target, key),
                paramType: 'header-param'
            };
        }
    }
}
export function Query(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].parameters =  target.__routes[key].parameters || [];
        target.__routes[key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'query'
        };
    } else {
        target.__properties =  target.__properties || {};
        target.__properties[key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'query'
        };
    }
}
export function Params(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].parameters =  target.__routes[key].parameters || [];
        target.__routes[key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'params'
        };
    } else {
        target.__properties =  target.__properties || {};
        target.__properties[key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'params'
        };
    }
}
export function Body(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].parameters =  target.__routes[key].parameters || [];
        target.__routes[key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'body'
        };
    } else {
        target.__properties =  target.__properties || {};
        target.__properties[key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'body'
        };
    }
}
export function Headers(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].parameters =  target.__routes[key].parameters || [];
        target.__routes[key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'headers'
        };
    } else {
        target.__properties =  target.__properties || {};
        target.__properties[key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'headers'
        };
    }
}
export function AppContext(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].parameters =  target.__routes[key].parameters || [];
        target.__routes[key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'app-context'
        };
    } else {
        target.__properties =  target.__properties || {};
        target.__properties[key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'app-context'
        };
    }
}
export function HttpContext(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target.__routes             = target.__routes || {};
        target.__routes[key]        = target.__routes[key] || {};
        target.__routes[key].parameters =  target.__routes[key].parameters || [];
        target.__routes[key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'http-context'
        };
    } else {
        target.__properties =  target.__properties || {};
        target.__properties[key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'http-context'
        };
    }
}
export function RouteResponse(target:Controller, key:string, index:number) {
    let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
    target.__routes             = target.__routes || {};
    target.__routes[key]        = target.__routes[key] || {};
    target.__routes[key].parameters =  target.__routes[key].parameters || [];
    target.__routes[key].parameters[index] = {
        index: index,
        type: type,
        key: '',
        paramType: 'response'
    };
}
