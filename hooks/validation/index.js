
module.exports = strapi => {
  const hook = {

    /**
     * Default options
     */

    defaults: {
      validation: {
        path: '/public/validation'
      }
    },

    /**
     * Initialize the hook
     */

    initialize: cb => {
    
      // a hook example
      // it's enabled by adding next lines in ./custom.json
      // "hook": {
      //   "validation": {
      //     "enabled": true
      //   }
      //   ...other hooks
      // }

      cb();
    }
  };

  return hook;
};