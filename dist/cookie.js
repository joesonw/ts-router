"use strict";
class Cookie {
    constructor() {
        this.content = '';
        this.path = '/';
        this.secure = true;
        this.httpOnly = true;
        this._expires = new Date();
        this._maxAge = 0;
    }
    get expires() {
        return this._expires;
    }
    set expires(date) {
        this._maxAge += (Math.floor(date.getTime() / 1000) - Math.floor(this._expires.getTime() / 1000));
        this._expires = date;
    }
    get maxAge() {
        return this._maxAge;
    }
    set maxAge(date) {
        this._expires = new Date(this._expires.getTime() + (date - this.maxAge) * 1000);
        this._maxAge = date;
    }
    toString() {
        let ret = this.content;
        ret += '; Path=' + this.path;
        ret += '; Expires=' + this.expires.toUTCString();
        if (this.secure)
            ret += '; Secure';
        if (this.httpOnly)
            ret += '; HttpOnly';
        return ret;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cookie;
