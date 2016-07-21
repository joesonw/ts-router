import * as tsRouter from '../src';
import * as chai from 'chai';
import * as request from 'supertest';
import * as Koa from 'koa';

@tsRouter.Path('/test')
class TestController extends tsRouter.Controller {
    @tsRouter.Path('')
    @tsRouter.GET
    @tsRouter.Produce(tsRouter.MediaType.TEXT)
    async index():Promise<tsRouter.Response> {
        return tsRouter.Response.status(200).charset(tsRouter.Charset.UTF8).body('hello').build();
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
    })
    it('should respond plain text in utf8', function (done)  {
        request(server)
            .get('/test')
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .expect('hello')
            .expect(200, done);
    });
})
