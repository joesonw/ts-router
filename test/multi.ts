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
    @tsRouter.Consume(tsRouter.MediaType.MULTIPART)
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index(
        @tsRouter.Body form:Object,
        @tsRouter.BodyParam('v1') v1:string,
        @tsRouter.BodyParam('v2') v2:string
    ):Promise<tsRouter.Response> {
        return tsRouter.Response.status(200).body({
            hello: v1,
            world: v2,
            form
        }).build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server = app.listen();
describe('POST with multipart', () => {
    after(() => {
        server.close();
    })
    it('response body back in json', function (done)  {
        request(app.listen())
            .post('/test')
            .field('v1', 'hello')
            .field('v2', 'world')
            .expect('Content-Type', 'application/json')
            .expect({
                form: {
                    v1: 'hello',
                    v2: 'world'
                },
                hello: 'hello',
                world: 'world'
            })
            .expect(200, done);
    });
})
