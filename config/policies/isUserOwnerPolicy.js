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

  if (user.role.name === 'Administrator') {
    return await next();
  }
  
  const isNotPermitted = ctx.query.user && ctx.query.user !== user.id;
  if (isNotPermitted) {
    ctx.forbidden('You are not permitted to view these items');
  }
  
  ctx.query = {
    user: user._id.toString(),
    ...ctx.query
  };

  await next();
};

