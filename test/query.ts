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

    @tsRouter.Query query:Object;
    @tsRouter.QueryParam('v1') v1:string;
    @tsRouter.QueryParam('v2') v2:string;

    @tsRouter.Path('/2')
    @tsRouter.GET
    @tsRouter.Produce(tsRouter.MediaType.JSON)
    async index2():Promise<tsRouter.Response> {
        let query   = this.query;
        let v1      = this.v1;
        let v2      = this.v2;
        return tsRouter.Response.status(200).body({v1, v2, query}).build();
    }
}

const app = new Koa();
const router = new tsRouter.Router();
router.use(TestController);
app.use(router.routes());
let server;
describe('GET with query', () => {
    before(() => {
        server = app.listen(3000)
    })
    after(() => {
        server.close();
    })
    it('should respond query in back in json', function (done)  {
        request(server)
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
    it('should respond query in back in json when params present', function (done)  {
        request(server)
            .get('/test/2')
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
