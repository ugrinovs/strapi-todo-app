'use strict';

/**
 * Policy for filtering items that belong to current user.
 * If user is administrator he will be able to see all requested items.
 * 
 * @param {Object} ctx node's request and response.
 * @param {Promise} next next action - in case of policies calling the controller.
 */
module.exports = async (ctx, next) => {
  
  const user = ctx.state.user;

  const isNotPermitted = ctx.query.user && ctx.query.user !== user.id;

  if (isNotPermitted) {
    ctx.forbidden('You are not permitted to view these items');
  }

  if (user.role.name === 'Administrator') {
    return;
  }
  
  ctx.query = {
    user: user.id,
    ...ctx.query
  };

  await next();
};

