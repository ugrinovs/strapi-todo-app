"use strict";

/**
 * Example of middleware. See Koa for more info (https://koajs.com)
 * @param {Strapi} strapi object containing whole app config. See (https://strapi.io/documentation/api-reference/reference.html)
 */
module.exports = strapi => {
  return {
    initialize: function(cb) {
      strapi.app.use(async (ctx, next) => {
        await next();

        // Example of middleware.
        // It needs to be structured as ./middlewares/<middlewareName>/index.js
        // To enable it you should go to ./config/environments/** and add next lines:
        // {
        //    "filter": {
        //      "enabled": true 
        //    }
        // }

      });

      cb();
    }
  };
};
