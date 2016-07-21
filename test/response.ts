import * as tsRouter from '../src';
import * as chai from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';

let cookie = new tsRouter.Cookie();
let date = new Date();
let newDate = new Date(date.getTime() + 30 * 1000);

@tsRouter.Path('/test')
class TestController extends tsRouter.Controller {

    @tsRouter.AppContext context:tsRouter.Context;
    @tsRouter.HttpContext ctx:Koa.Context;

    @tsRouter.Path('')
    @tsRouter.GET
    async index(@tsRouter.HttpContext ctx:Koa.Context):Promise<tsRouter.Response> {
        cookie.expires = date;
        cookie.maxAge = 30;
        return tsRouter.Response
            .status(200)
            .header('x-hello', 'world')
            .type(tsRouter.MediaType.TEXT)
            .allow(tsRouter.HttpMethod.GET, tsRouter.HttpMethod.POST, tsRouter.HttpMethod.PUT, tsRouter.HttpMethod.DELETE)
            .charset('utf-8')
            .expires(date)
            .body(ctx.method)
            .lastModified(date)
            .cookie(cookie)
            .build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server;
describe('GET plain text', () => {
    before(() => {
        server = app.listen(3000)
    })
    after(() => {
        server.close();
    });
    it('response with all response features ', function (done)  {
        request(server)
            .get('/test')
            .expect('x-hello', 'world')
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .expect('Allow', 'GET,POST,PUT,DELETE')
            .expect('Cache-Control', date.toUTCString())
            .expect('Last-Modified', date.toUTCString())
            .expect('Set-Cookie', `; Path=/; Expires=${newDate.toUTCString()}; Secure; HttpOnly`)
            .expect('GET')
            .expect(200, done);
    });
})
