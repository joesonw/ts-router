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


    @tsRouter.Body body:Object;
    @tsRouter.BodyParam('v1') v1:string;
    @tsRouter.BodyParam('v2') v2:string;

    @tsRouter.Path('/2')
    @tsRouter.POST
    @tsRouter.Consume(tsRouter.MediaType.JSON)
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index2():Promise<tsRouter.Response> {
        let body    = this.body;
        let v1      = this.v1;
        let v2      = this.v2;
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
let server;
describe('POST with body', () => {
    before(() => {
        server = app.listen(3000)
    })
    after(() => {
        server.close();
    });
    it('should respond body back in json', function (done)  {
        request(server)
            .post('/test')
            .send({
                v1: 'hello',
                v2: 'world'
            })
            .set('Content-Type', 'application/json;charset=utf-8')
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
    it('should route to correct subroute and respond body back in json', function (done)  {
        request(server)
            .post('/test/2')
            .send({
                v1: 'hello',
                v2: 'world'
            })
            .set('Content-Type', 'application/json;charset=utf-8')
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
