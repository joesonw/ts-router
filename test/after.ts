/// <reference path="../typings/mocha/mocha.d.ts"/>
/// <reference path="../typings/chai/chai.d.ts"/>
/// <reference path="../typings/supertest/supertest.d.ts"/>
/// <reference path="../typings/koa/koa.d.ts"/>

import * as tsRouter from '../src';
import * as chai from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';

@tsRouter.Path('/test')
class TestController extends tsRouter.Controller {
    @tsRouter.Path('/:v1/:v2')
    @tsRouter.GET
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index(
        @tsRouter.Params params:Object,
        @tsRouter.PathParam('v1') v1:string,
        @tsRouter.PathParam('v2') v2:string
    ):Promise<tsRouter.Response> {
        return tsRouter.Response.status(200).body({v1, v2, params}).build();
    }

    @tsRouter.After
    async after(
        @tsRouter.Params params:Object,
        @tsRouter.PathParam('v1') v1:string,
        @tsRouter.PathParam('v2') v2:string,
        @tsRouter.AppContext context:tsRouter.Context,
        @tsRouter.RouteResponse res:tsRouter.Response
    ) {
        res.body = JSON.stringify({v1, v2, params, v3: v1 + v2});
        res.send(context);
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server = app.listen();
describe('GET with path paramters with afterwares', () => {
    after(() => {
        server.close();
    })
    it('response paramters in back in json', function (done)  {
        request(app.listen())
            .get('/test/hello/world')
            .expect('Content-Type', 'application/json')
            .expect({
                params: {
                    v1: 'hello',
                    v2: 'world'
                },
                v1: 'hello',
                v2: 'world',
                v3: 'helloworld'
            })
            .expect(200, done);
    });
})
