'use strict';

/**
 * Policy for checking if user can execute crud operations on certain todo.
 * 
 * @param {KoaContext} ctx - node's request and response.
 * @param {Promise} next - next action - in case of policies calling the controller.
 */
module.exports = async (ctx, next) => {
  const user = ctx.state.user;
  if (!user) {
    return ctx.unauthorized('You\'re not logged in!');
  }

  const paramId = ctx.params._id;
  const todoBelongsToUser = user.todos.find(findByTodoId(paramId));

  const currentUserId = user._id.toString();
  const hasTodo = ctx.request.body._id && ctx.request.body._id.toString() === currentUserId;

  if (todoBelongsToUser || hasTodo) {
    return await next();
  }
  
  return ctx.forbidden('Forbidden');
};
function findByTodoId(paramId) {
  return todo => todo._id.toString() === paramId;
}

