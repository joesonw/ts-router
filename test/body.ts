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
    @tsRouter.POST
    @tsRouter.Consume(tsRouter.MediaType.JSON)
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index(
        @tsRouter.Body body:Object,
        @tsRouter.BodyParam('v1') v1:string,
        @tsRouter.BodyParam('v2') v2:string
    ):Promise<tsRouter.Response> {
        return tsRouter.Response.status(200).body({
            hello: v1,
            world: v2,
            body
        }).build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server = app.listen();
describe('POST with body', () => {
    after(() => {
        server.close();
    })
    it('response body back in json', function (done)  {
        request(app.listen())
            .post('/test')
            .send({
                v1: 'hello',
                v2: 'world'
            })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect({
                body: {
                    v1: 'hello',
                    v2: 'world'
                },
                hello: 'hello',
                world: 'world'
            })
            .expect(200, done);
    });
})
