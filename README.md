[![Node version][node-image]][npm-url]
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependencies][david-image]][david-url]

#Announcement

ts-router is not maintained anymore, please use [@t2ee/vader](https://github.com/t2ee/vader) for typescript routing service, [@t2ee/vader](https://github.com/t2ee/vader) will be actively maintained, as part of [t2ee](https://github.com/t2ee)(Typescript To Enterprise Edition) organization.

[@t2ee/vader](https://github.com/t2ee/vader) is based of this package, they shares +90% APIs.

## Installation

```
$ npm install ts-router
```

ts-router is supported in node v4+ with `--harmony` flag.

## Introduction

This project is developed in typescript, and usable in typescript. It serves as a routing middleware for koa@next.

More documentations will be added soon, for immediate access to all features, please refer to the declaration file.

PRs and Issues are welcome


## Example

```js
/// <reference path="./typings/ts-router/ts-router.d.ts"/>
/// <reference path="./typings/koa/koa.d.ts"/>


import {Before, Consume, MediaType, Response, Controller, Router, Path, POST, QueryParam, PathParam, BodyParam} from 'ts-router';
import * as Koa from 'koa';


const app = new Koa();
const router = new Router();

@Path('/user')
class UserRoute extends Controller {
    private user:User;
    @PathParam('_id') userId:string;

    constructor() {
        super();
        //The controller will be created upon each request, so it is safe to initialize variables here for all other routes.
        this.user = getFromMemoryCache();
    }

    @Before
    async getUserBeforeAll(@PathParam('_id') userId:string) {
        this.user = await dbAction({_id: this.userId});
    }

    @Path('/:_id')
    @POST
    @Consume(MediaType.JSON)
    async updateUser(@QueryParam('name') name:string,
        @BodyParam('password') password:string):Promise<Response> {
        this.user.name = name;
        this.user.password = password;
        await user.save();
        return Response.status(200).body('success').build();
    }
}

router.use(UserRoute);
app.use(router.routes());
app.listen(3000);

console.log('started');
```

## API
### Main
#### Controller
This is where you get started, have a class extends it.

```js
    class Test extends Controller {

    }
```

#### Router
This is the central part where all `Controllers` are controlled.

```js
    class Test extends Controller {
    }
    let router = new Router();
    router.use(Test);
    let app = new Koa();
    app.use(router.routes());
```

#### ResponseBuilder
This is a helper class builds `Response`.
* `status(number | Response.Status)` - set response status.
* `header(string,string)` - set header.
* `type(MediaType)` - set return type.
* `body(any)` - it can be an object (can be compiled using `JSON.stringify`) or string.
* `allow(...methods: (string | HttpMethod)[])` - set `Allow` header.
* `charset(Charset | string)` - set charset of response body.
* `expires(Date)` - set `Expires` header.
* `lastModified(Date)` - set `Last-Modified` header.
* `cookie(Cookie)` - set cookie to be returned from the response.
* `build():Response` - finish building Response.

#### Response
This is to be returned from a route;
* `static status(number | Response.Status)` - set response status and returns the build helper.
* `body: any` - property.
* `status: number` - property.
* `headers: { [key:string] : string}` - property.
* `send(Context)` - to send response to the client.

#### Context
This extends `Koa.IContext`
* `cookie: Cookie` - property.
* `params: Object` - property, parsed path params.
* `requestBody: any` - property, parsed request body.

#### Cookie
Cookie object
* `content: string` - property. e.g, `sessionId: 12345678`.
* `path: string` - property.
* `secure: boolean` - property.
* `httpOnly: boolean` - property.
* `expires: Date` - property.
* `maxAge: number` - property.
* `toString():string` - parse the cookie object to `Set-Cookie` header value.

### Annotations

#### `@Before`
method decorator, to be ran before all other routes.

#### `@After`
method decorator, to be ran after all other routes.

#### `@GET`
method decorator, set the route method to `GET`.

#### `@POST`
method decorator, set the route method to `POST`.

#### `@PUT`
method decorator, set the route method to `PUT`.

#### `@DELETE`
method decorator, set the route method to `DELETE`.

#### `@Inject(Function)`
method decorator, run before route and after controller before wares.

#### `@Path(string)`
method decorator, set the route path. (Can be applied multiple times on one route).

```js
    @Path('/index')
    @Path('/')
    async index():Promise<Response> {
        return Response.status(200).build();
    }
    // both '/index' and '/' will be directed to this route.
```

#### `@Produce(MediaType)`
method decorator, set `Content-Type` of response.

#### `@Consume(MediaType)`
method decorator, set to be processed body content type, and parse it accordingly.

#### `@QueryParam(string)`
property or parameter decorator, retrieve query variable with provided key.

#### `@PathParam(string)`
property or parameter decorator, retrieve params variable with provided key.

#### `@HeaderParam(string)`
property or parameter decorator, retrieve header variable with provided key.

#### `@BodyParam(string)`
property or parameter decorator, retrieve body variable with provided key.

#### `@Query`
property or parameter decorator, retrieve the whole query.

#### `@Params`
property or parameter decorator, retrieve all params.

#### `@Headers`
property or parameter decorator, retrieve all headers.

#### `@Body`
property or parameter decorator, retrieve the whole body.

#### `@AppContext`
property or parameter decorator, retrieve Context object of current route.

#### `@HttpContext`
property or parameter decorator, retrieve Koa Context.

#### `@RouteResponse`
parameter decorator, retrieve the response after executing route (used in `@Before` mostly).

### Misc
#### `mediaTypeToString(MediaType): string`
parse `MediaType` to string. e.g, `MediaType.JSON` to `application/json`.

#### `enum Charset`
* `UTF8`

#### `enum HttpMethod`
* `GET`
* `POST`
* `PUT`
* `DELETE`

#### `enum MediaType`
* `TEXT`
* `MULTIPART`
* `JSON`
* `FORM`

#### `enum Response.Status`

* `ACCEPTED` - 202.
* `BAD_GATEWAY` - 502.
* `BAD_REQUEST` - 400.
* `CONFLICT` - 409.
* `CREATED` - 201.
* `EXPECTATION_FAILED` - 417.
* `FORBIDDEN` - 403.
* `FOUND` - 302.
* `GATEWAY_TIMEOUT` - 504.
* `GONE` - 410.
* `HTTP_VERSION_NOT_SUPPORTED` - 505.
* `INTERNAL_SERVER_ERROR` - 500.
* `LENGTH_REQUIRED` - 411.
* `METHOD_NOT_ALLOWED` - 405.
* `MOVED_PERMANENTLY` - 301.
* `NO_CONTENT` - 204.
* `NOT_ACCEPTABLE` - 406.
* `NOT_FOUND` - 404.
* `NOT_IMPLEMENTED` - 501.
* `NOT_MODIFIED` - 304.
* `OK` - 200.
* `PARTIAL_CONTENT` - 206.
* `PAYMENT_REQUIRED` - 402.
* `PRECONDITION_FAILED` - 412.
* `PROXY_AUTHENTICATION_REQUIRED` - 407.
* `REQUEST_ENTITY_TOO_LARGE` - 413.
* `REQUEST_TIMEOUT` - 408.
* `REQUEST_URI_TOO_LONG` - 414.
* `REQUESTED_RANGE_NOT_SATISFIABLE` - 416.
* `RESET_CONTENT` - 205.
* `SEE_OTHER` - 303.
* `SERVICE_UNAVAILABLE` - 503.
* `TEMPORARY_REDIRECT` - 307.
* `UNAUTHORIZED` - 401.
* `UNSUPPORTED_MEDIA_TYPE` - 415.
* `USE_PROXY` = 305









## License

The MIT License (MIT)
Copyright (c) <2016> <Qiaosen Huang>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-image]: https://img.shields.io/npm/v/ts-router.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ts-router
[node-image]: https://img.shields.io/node/v/ts-router.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/joesonw/ts-router/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/joesonw/ts-router
[coveralls-image]: https://img.shields.io/coveralls/joesonw/ts-router/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/joesonw/ts-router?branch=master
[david-image]: https://img.shields.io/david/joesonw/ts-router.svg?style=flat-square
[david-url]: https://david-dm.org/joesonw/ts-router
