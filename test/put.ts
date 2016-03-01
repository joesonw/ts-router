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
    @tsRouter.PUT
    async index():Promise<tsRouter.Response> {
        return tsRouter.Response.status(200).body('hello').build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server = app.listen();
describe('PUT plain text', () => {
    after(() => {
        server.close();
    })
    it('response plain text', function (done)  {
        request(app.listen())
            .put('/test')
            .expect('Content-Type', 'text/plain')
            .expect('hello')
            .expect(200, done);
    });
})
