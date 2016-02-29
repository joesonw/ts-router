import {MediaType } from './util';
abstract class Controller {
    __routes:{ [key:string]: {
        method?:    string;
        filter?:    'after' | 'before';
        path?:      string[];
        produce?:   MediaType;
        consume?:   MediaType;
        parameters?: {
            index: number;
            type: Function;
            key: string;
            paramType: string;
        }[];
    }};
    __properties: { [key:string] : {
        key: string;
        type: Function;
        paramType: string;
    }};
    __path:string;
}

export default Controller;
