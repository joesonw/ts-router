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
        @tsRouter.Headers headers:Object,
        @tsRouter.HeaderParam('v1') v1:string,
        @tsRouter.HeaderParam('v2') v2:string
    ):Promise<tsRouter.Response> {
        return tsRouter.Response.status(200).body({
            v1: headers['v1'] + v1,
            v2: headers['v2'] + v2
        }).build();
    }
    @tsRouter.Headers headers:Object;
    @tsRouter.HeaderParam('v1') v1:string;
    @tsRouter.HeaderParam('v2') v2:string;

    @tsRouter.Path('/2')
    @tsRouter.GET
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index2():Promise<tsRouter.Response> {
        let headers = this.headers;
        let v1      = this.v1;
        let v2      = this.v2;
        return tsRouter.Response.status(200).body({
            v1: headers['v1'] + v1,
            v2: headers['v2'] + v2
        }).build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server;
describe('GET with headers', () => {
    before(() => {
        server = app.listen(3000)
    })
    after(() => {
        server.close();
    })
    it('should respond headers back in json', function (done)  {
        request(server)
            .get('/test')
            .set('v1', 'hello')
            .set('v2', 'world')
            .expect('Content-Type', 'application/json')
            .expect({
                v1: 'hellohello',
                v2: 'worldworld'
            })
            .expect(200, done);
    });

    it('should route to correct subroute and respondheaders back in json', function (done)  {
        request(server)
            .get('/test/2')
            .set('v1', 'hello')
            .set('v2', 'world')
            .expect('Content-Type', 'application/json')
            .expect({
                v1: 'hellohello',
                v2: 'worldworld'
            })
            .expect(200, done);
    });
})
