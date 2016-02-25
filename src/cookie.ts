class Cookie {
    content: string = '';
    path: string = '/';
    secure: boolean = true;
    httpOnly: boolean = true;
    private _expires: Date;
    private _maxAge: number;
    get expires(): Date {
        return this._expires;
    }
    set expires(date:Date) {
        this._maxAge += (Math.floor(date.getTime() / 1000) - Math.floor(this._expires.getTime() / 1000));
        this._expires = date;
    }
    get maxAge():number {
        return this._maxAge;
    }
    set maxAge(date: number) {
        this._expires = new Date(this._expires.getTime() + (date - this.maxAge) * 1000);
        this.maxAge = date;
    }
    toString():string {
        let ret = this.content;
        ret += '; Path=' + this.path;
        ret += '; Expires=' + this.expires.toUTCString();
        if (this.secure) ret += '; Secure';
        if (this.httpOnly) ret += '; HttpOnly';

        return ret;
    }
}
export default Cookie;
