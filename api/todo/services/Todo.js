'use strict';

/**
 * Todo.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');
const AsyncErrorHandler = require('../../../services/AsyncErrorHandler');

module.exports = {

  /**
   * Promise to fetch all todos.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('todo', params);
    // Select field to populate.
    const populate = Todo.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Todo
      .find()
      .where(filters.where)
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  },

  /**
   * Promise to fetch a/an todo.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Todo.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Todo
      .findOne(_.pick(params, _.keys(Todo.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to count todos.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('todo', params);

    return Todo
      .count()
      .where(filters.where);
  },

  /**
   * Promise to add a/an todo.
   *
   * @return {Promise}
   */

  add: async (values, currentUser) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Todo.associations.map(ast => ast.alias));
    const data = { ..._.omit(values, Todo.associations.map(ast => ast.alias)), user: currentUser };

    // Create entry with no-relational data.
    const entry = await Todo.create(data);

    // Create relational data and return the entry.
    return Todo.updateRelations({ _id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an todo.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Todo.associations.map(a => a.alias));
    const data = _.omit(values, Todo.associations.map(a => a.alias));
    // Update entry with no-relational data.

    await AsyncErrorHandler(Todo.update(params, data, { multi: true, runValidators: true }), 406);

    // Update relational data and return the entry.
    return Todo.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an todo.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Todo.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Todo
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Todo.associations.map(async association => {
        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  },

  /**
   * Promise to search a/an todo.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('todo', params);
    // Select field to populate.
    const populate = Todo.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    const $or = Object.keys(Todo.attributes).reduce((acc, curr) => {
      switch (Todo.attributes[curr].type) {
        case 'integer':
        case 'float':
        case 'decimal':
          if (!_.isNaN(_.toNumber(params._q))) {
            return acc.concat({ [curr]: params._q });
          }

          return acc;
        case 'string':
        case 'text':
        case 'password':
          return acc.concat({ [curr]: { $regex: params._q, $options: 'i' } });
        case 'boolean':
          if (params._q === 'true' || params._q === 'false') {
            return acc.concat({ [curr]: params._q === 'true' });
          }

          return acc;
        default:
          return acc;
      }
    }, []);

    return Todo
      .find({ $or })
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  }
};
