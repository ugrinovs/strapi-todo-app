'use strict';


module.exports = strapi => {
  const defaults = {
    pageNum: 0,
    limit: 100
  };

  return {
    initialize: function(cb) {
      strapi.app.use(async (ctx, next) => {

        const pageNum = ctx.query.pageNum || defaults.pageNum;
        const _limit = ctx.query._limit || defaults.limit;

        delete ctx.query.pageNum;
        
        ctx.query = {
          ...ctx.query,
          _start: pageNum * _limit,
          _limit,
        };

        await next();
      });

      cb();
    }
  };
};