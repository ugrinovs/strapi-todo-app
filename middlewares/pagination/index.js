'use strict';


module.exports = strapi => {
  const defaults = {
    page: 0,
    perPage: 100
  };

  return {
    initialize: function(cb) {
      strapi.app.use(async (ctx, next) => {


        //FIXME investigate where is best to add pagination
        // this is a quickfix so we can still access strapi's admin panel
        // probably would be best to put it on get requests only on /api routes
        if (ctx.path !== '/todo') {
          return await next();
        }
        const page = Number(ctx.query.page || defaults.page);
        const _limit = Number(ctx.query.perPage || defaults.perPage);

        delete ctx.query.page;
        delete ctx.query.perPage;
        delete ctx.query.totalPages;
        
        ctx.query = {
          ...ctx.query,
          _start: page * _limit,
          _limit,
        };

        await next();

        const api = strapi.api;
        const foundModel = Object.keys(api).find(model => strapi.api[model].config.routes.find(route => route.path === ctx.path));

        let totalItemCount = 0;
        if (foundModel) {
          totalItemCount = await strapi.api[foundModel].services[foundModel].count(ctx.query);
        }

        const data = ctx.response.body;

        ctx.response.body = {
          data,
          page,
          perPage: _limit,
          totalPages: Math.ceil(totalItemCount/_limit)
        };
      });

      cb();
    }
  };
};