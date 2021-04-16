module.exports = {
  getStore: () => {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: "plugin",
      name: "fem-acuity",
    });
    return pluginStore;
  },

};