declare class Cookie {
    content: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    private _expires;
    private _maxAge;
    constructor();
    expires: Date;
    maxAge: number;
    toString(): string;
}
export default Cookie;
