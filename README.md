# Todos api created with [strapi](https://strapi.io/)

## Basic Functionallities
  - Unique todos for every user
  - Login
  - JWT for auth
  - Filter for getting certain todos
  - Roles (admin sees all todos)

## Strapi
### Cons
- Controller has no suffix
- Choose between plural routes and models(e.g. /api/todos and model name Todos) or singular (/api/todo and model name Todo)
- Only command for generating content is generate api which generates controllers, routes and model so you don’t have much flexibility regarding what you generate
- No configuration on what’s generated with the command


### Pros
- You can create a dry project with strap new <projectName> —dry and then add plugins when needed
- Every model can have lifecycle hooks

### Debugging with VSCode
- Debugging can be done easily with VSCode by creating a launch.json configuration(Debug > Add Configuration) and selecting Node.js: Run Program. Just make sure that “program” points to server.js. 
  VSCode Debugger + Auto reload
- Since strapi currently doesn’t support auto reload, if you want to have a debugger with it you should use nodemon (when installed just change start script in package.json to use nodemon instead of node). Make sure to make a nodemon.json file in project root and add an ignore option similar to this: "ignore": ["**/config/*.json”] in order to avoid endless auto reload when starting nodemon (due to constant file changes in strapi code)
- After you’ve set up nodemon you can then ‘Add Configuration’ for ‘Node.js: Nodemon setup’, make sure you specify which file to run (should be server.js in root folder if it was not renamed) 
- If you haven’t saved nodemon globally but as a dev dependency then you should change runtimeExecutable to point to that executable (“${workspaceFolder}/node_modules/.bin/nodemon”)

### Notices
- Policies are used for per route actions
- Middlewares are used for all requests/response
- Uses mongoose in the background which means that we can leverage it’s integrated validator functions

### Mongoose
- Supports orm validation
- By default only validation on save is supported
- Error handling can be supported by providing useValidator: true option for mongoose (usually third param)
- Since mongo uses async functions calls should be wrapped in some custom error handler since by default strap handles failures as status 500.
