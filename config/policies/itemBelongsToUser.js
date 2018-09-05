'use strict';

module.exports = async (ctx, next) => {
  if (ctx.state.user) {
    await next();

    const currentUserId = ctx.state.user._id.toString();
    if (ctx.body.user && ctx.body.user._id.toString() === currentUserId) {
      return;
    }
    return ctx.forbidden('Forbidden');
  }

  ctx.unauthorized('You\'re not logged in!');
};
