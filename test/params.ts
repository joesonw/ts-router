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
    @tsRouter.Params params:Object;
    @tsRouter.PathParam('v1') v1:string;
    @tsRouter.PathParam('v2') v2:string;

    @tsRouter.Path('/2/:v1/:v2')
    @tsRouter.Path('/3/:v1/:v2')
    @tsRouter.GET
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index2():Promise<tsRouter.Response> {
        let params  = this.params;
        let v1      = this.v1;
        let v2      = this.v2;
        return tsRouter.Response.status(200).body({v1, v2, params}).build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server = app.listen();
describe('GET with path paramters', () => {
    after(() => {
        server.close();
    });
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
                v2: 'world'
            })
            .expect(200, done);
    });
    it('response paramters in back in json', function (done)  {
        request(app.listen())
            .get('/test/2/hello/world')
            .expect('Content-Type', 'application/json')
            .expect({
                params: {
                    v1: 'hello',
                    v2: 'world'
                },
                v1: 'hello',
                v2: 'world'
            })
            .expect(200, done);
    });
    it('response paramters in back in json', function (done)  {
        request(app.listen())
            .get('/test/3/hello/world')
            .expect('Content-Type', 'application/json')
            .expect({
                params: {
                    v1: 'hello',
                    v2: 'world'
                },
                v1: 'hello',
                v2: 'world'
            })
            .expect(200, done);
    });
})
