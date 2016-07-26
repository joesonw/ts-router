import Controller from './controller';
import {ReflectType, MediaType } from './util';
import Context from './context';
import 'reflect-metadata';
import {
    Routes,
    Properties,
    RoutePath,
} from './symbols';

export function Before(target:Controller, key:string) {
    target[Routes]                 = target[Routes] || {};
    target[Routes][key]            = target[Routes][key] || {};
    target[Routes][key].filter     = 'before';
}
export function After(target:Controller, key:string) {
    target[Routes]                 = target[Routes] || {};
    target[Routes][key]            = target[Routes][key] || {};
    target[Routes][key].filter     = 'after';
}
export function GET(target:Controller, key:string) {
    target[Routes]                 = target[Routes] || {};
    target[Routes][key]            = target[Routes][key] || {};
    target[Routes][key].method     = 'GET';
}
export function POST(target:Controller, key:string) {
    target[Routes]                 = target[Routes] || {};
    target[Routes][key]            = target[Routes][key] || {};
    target[Routes][key].method     = 'POST';
}
export function PUT(target:Controller, key:string) {
    target[Routes]                 = target[Routes] || {};
    target[Routes][key]            = target[Routes][key] || {};
    target[Routes][key].method     = 'PUT';
}
export function DELETE(target:Controller, key:string) {
    target[Routes]                 = target[Routes] || {};
    target[Routes][key]            = target[Routes][key] || {};
    target[Routes][key].method     = 'DELETE';
}
export function Inject(func:Function) {
    return (target:Controller, key:string) => {
        target[Routes]                 = target[Routes] || {};
        target[Routes][key]            = target[Routes][key] || {};
        target[Routes][key].injection  = target[Routes][key].injection || [];
        target[Routes][key].injection.push(func);
    }
}
export function Path(path:string) {
    return (target:Controller | (new () => Controller), key?:string) => {
        if (key) {
            let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key);
            (target as Controller)[Routes]  = (target as Controller)[Routes] || {};
            (target as Controller)[Routes][key] = (target as Controller)[Routes][key] || {};
            (target as Controller)[Routes][key].path = (target as Controller)[Routes][key].path || [];
            (target as Controller)[Routes][key].path.push(path);
        } else {
            (target as (new () => Controller)).prototype[RoutePath] = path;
        }
    }
}
export function Produce(type: MediaType) {
    return (target:Controller, key:string) => {
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].produce = type;
    }
}
export function Consume(type: MediaType) {
    return (target:Controller, key:string) => {
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].consume = type;
    }
}
export function QueryParam(param: string) {
    return (target:Controller, key:string, index?:number) => {
        if (index !== undefined) {
            let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
            target[Routes]             = target[Routes] || {};
            target[Routes][key]        = target[Routes][key] || {};
            target[Routes][key].parameters =  target[Routes][key].parameters || [];
            target[Routes][key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'query-param'
            };
        } else {
            target[Properties] =  target[Properties] || {};
            target[Properties][key] = {
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
            target[Routes]             = target[Routes] || {};
            target[Routes][key]        = target[Routes][key] || {};
            target[Routes][key].parameters =  target[Routes][key].parameters || [];
            target[Routes][key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'path-param'
            };
        } else {
            target[Properties] =  target[Properties] || {};
            target[Properties][key] = {
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
            target[Routes]             = target[Routes] || {};
            target[Routes][key]        = target[Routes][key] || {};
            target[Routes][key].parameters =  target[Routes][key].parameters || [];
            target[Routes][key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'body-param'
            };
        } else {
            target[Properties] =  target[Properties] || {};
            target[Properties][key] = {
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
            target[Routes]             = target[Routes] || {};
            target[Routes][key]        = target[Routes][key] || {};
            target[Routes][key].parameters =  target[Routes][key].parameters || [];
            target[Routes][key].parameters[index] = {
                index: index,
                type: type,
                key: param,
                paramType: 'header-param'
            };
        } else {
            target[Properties] =  target[Properties] || {};
            target[Properties][key] = {
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
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].parameters =  target[Routes][key].parameters || [];
        target[Routes][key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'query'
        };
    } else {
        target[Properties] =  target[Properties] || {};
        target[Properties][key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'query'
        };
    }
}
export function Params(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].parameters =  target[Routes][key].parameters || [];
        target[Routes][key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'params'
        };
    } else {
        target[Properties] =  target[Properties] || {};
        target[Properties][key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'params'
        };
    }
}
export function Body(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].parameters =  target[Routes][key].parameters || [];
        target[Routes][key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'body'
        };
    } else {
        target[Properties] =  target[Properties] || {};
        target[Properties][key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'body'
        };
    }
}
export function Headers(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].parameters =  target[Routes][key].parameters || [];
        target[Routes][key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'headers'
        };
    } else {
        target[Properties] =  target[Properties] || {};
        target[Properties][key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'headers'
        };
    }
}
export function AppContext(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].parameters =  target[Routes][key].parameters || [];
        target[Routes][key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'app-context'
        };
    } else {
        target[Properties] =  target[Properties] || {};
        target[Properties][key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'app-context'
        };
    }
}
export function HttpContext(target:Controller, key:string, index?:number) {
    if (index !== undefined) {
        let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
        target[Routes]             = target[Routes] || {};
        target[Routes][key]        = target[Routes][key] || {};
        target[Routes][key].parameters =  target[Routes][key].parameters || [];
        target[Routes][key].parameters[index] = {
            index: index,
            type: type,
            key: '',
            paramType: 'http-context'
        };
    } else {
        target[Properties] =  target[Properties] || {};
        target[Properties][key] = {
            key: '',
            type: Reflect.getMetadata(ReflectType.TYPE, target, key),
            paramType: 'http-context'
        };
    }
}
export function RouteResponse(target:Controller, key:string, index:number) {
    let type:Function = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key)[index];
    target[Routes]             = target[Routes] || {};
    target[Routes][key]        = target[Routes][key] || {};
    target[Routes][key].parameters =  target[Routes][key].parameters || [];
    target[Routes][key].parameters[index] = {
        index: index,
        type: type,
        key: '',
        paramType: 'response'
    };
}
