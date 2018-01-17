const Koa = require('koa');
const app = module.exports = new Koa();

const mongoose = require('./libs/mongoose');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();

handlers.forEach(handler => require('./handlers/' + handler).init(app));

const Router = require('koa-router');
const pick = require('lodash/pick');


const router = new Router({
    prefix: '/users'
});

const User = require('./libs/user');

async function loadUserById(ctx, next) {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.userById)) {
        ctx.throw(404);
    }
    
    ctx.userById = await User.findById(ctx.params.userById);
    if (!ctx.userById) {
        ctx.throw(404);
    }

    await next();
}

router
    .post('/', async (ctx, next) => {
        let user = await User.create(pick(ctx.request.body, User.publicFields));

        ctx.body = user.toObject();
    })
    .patch('/:userById', loadUserById, async (ctx) => {
        Object.assign(ctx.userById, pick(ctx.request.body, User.publicFields));
        await ctx.userById.save();

        ctx.body = ctx.userById.toObject();
    })
    .get('/:userById', loadUserById, async (ctx) => {
        ctx.body = ctx.userById.toObject();
    })
    .del('/:userById', loadUserById, async (ctx) => {
        await ctx.userById.remove();
        ctx.body = 'ok';
    })
    .get('/', async (ctx) => {
        let users = await User.find({});
        ctx.body = users.map( user => user.toObject());
    });

app.use(router.routes());