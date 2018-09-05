'use strict';

/**
 * Policy for filtering items that belong to current user.
 * If user is administrator he will be able to see all requested items.
 * 
 * @param {Object} ctx node's request and response.
 * @param {Promise} next next action - in case of policies calling the controller.
 */
module.exports = async (ctx, next) => {
  
  await next();
  
  const user = ctx.state.user;
  if (user.role.name === 'Administrator') {
    return;
  }

  const currentUserId = user._id.toString();
  ctx.body = ctx.body.filter(filterByUser(currentUserId));
};

function filterByUser(currentUserId) {
  return item => item.user && item.user._id.toString() === currentUserId;
}

