const { parsed } = require('dotenv-safe').config();

export default (config, env, helpers) => {
  const { plugin } = helpers.getPluginsByName(config, 'HtmlWebpackPlugin')[0] || {};

  if (plugin) {
    plugin.options.timeInMs =  Date.now(),
    plugin.options.env = Object.assign(env, parsed);
  }
};
