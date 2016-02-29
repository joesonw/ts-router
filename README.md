
# Introduction

This project is developed in typescript, and usable in typescript. It serves as a routing middleware for koa@next.

More documentations will be added soon, for immediate access to all features, please refer to the declaration file.

# Example

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
