"use strict";

/**
 * Example of middleware see Koa for more info (https://koajs.com)
 * @param {Strapi} strapi object containing whole app config. See (https://strapi.io/documentation/api-reference/reference.html)
 */
module.exports = strapi => {
  return {
    initialize: function(cb) {
      strapi.app.use(async (ctx, next) => {
        await next();

        // example of middle
        // it will needs to be structured as ./middlewares/<middlewareName>/index.js
        // to enable it you should enable it in ./config/environments/**
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
