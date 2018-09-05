'use strict';

/**
 * Todo.js controller
 *
 * @description: A set of functions called "actions" for managing `Todo`.
 */

module.exports = {

  /**
   * Retrieve todo records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.todo.search(ctx.query);
    } else {
      return strapi.services.todo.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a todo record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.todo.fetch(ctx.params);
  },

  /**
   * Count todo records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.todo.count(ctx.query);
  },

  /**
   * Create a/an todo record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.todo.add(ctx.request.body);
  },

  /**
   * Update a/an todo record.
   *
   * @return {Object}
   */

  update: async (ctx) => {
    return strapi.services.todo.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an todo record.
   *
   * @return {Object}
   */

  destroy: async (ctx) => {
    return strapi.services.todo.remove(ctx.params);
  }
};
