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
    @tsRouter.Path('')
    @tsRouter.GET
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index(
        @tsRouter.Query query:Object,
        @tsRouter.QueryParam('v1') v1:string,
        @tsRouter.QueryParam('v2') v2:string
    ):Promise<tsRouter.Response> {
        return tsRouter.Response.status(200).body({v1, v2, query}).build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server = app.listen();
describe('GET with query', () => {
    after(() => {
        server.close();
    })
    it('response query in back in json', function (done)  {
        request(app.listen())
            .get('/test')
            .query({
                v1: 'hello',
                v2: 'world'
            })
            .expect('Content-Type', 'application/json')
            .expect({
                query: {
                    v1: 'hello',
                    v2: 'world'
                },
                v1: 'hello',
                v2: 'world'
            })
            .expect(200, done);
    });
})
