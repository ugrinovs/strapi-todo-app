'use strict';

module.exports = async (ctx, next) => {
  
  await next();

  const currentUserId = ctx.state.user._id.toString();
  ctx.body = ctx.body.filter(filterByUser(currentUserId));
};

function filterByUser(currentUserId) {
  return item => item.user && item.user._id.toString() === currentUserId;
}

