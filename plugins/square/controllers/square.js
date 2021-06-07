"use strict";
const controllerUtils = require("../../utils/index");
const { Client, Environment } = require("square");
/**
 * square.js controller
 *
 * @description: A set of functions called "actions" of the `square` plugin.
 */

module.exports = {
  /**
   * Retrieves Square API key.
   *
   * @return {Object}
   */

  retrieveSettings: async (ctx) => {
    const { user } = ctx.state;

    // Ensure user is admin here
    if (user.roles[0].name !== "Super Admin") {
      return ctx.unauthorized("Only administrators allowed!");
    }

    const pluginStore = controllerUtils.getStore();

    const getSquareSettings = async (key1) => {
      const pk = await pluginStore.get({ key: key1 });

      return {
        pk,
      };
    };
    const { pk } = await getSquareSettings("squarePk");

    ctx.send({
      pk: pk ? pk : "",
    });
  },
  updateSettings: async (ctx) => {
    const { user } = ctx.state;
    const { pk } = ctx.request.body;

    // make sure user is admin
    if (user.roles[0].name !== "Super Admin") {
      return ctx.unauthorized("Only administrators allowed!");
    }

    if (!pk) {
      return ctx.throw(400, "Please make sure all fields are filled correctly");
    }
    const pluginStore = controllerUtils.getStore();

    const setValues = async (apiKey) => {
      await pluginStore.set({ key: "squarePk", value: apiKey });
    };

    const result = await setValues(pk);

    ctx.send({
      result,
    });
  },
  createCustomer: async (ctx) => {
    const { body } = ctx.request;
    const pluginStore = controllerUtils.getStore();

    const getSquareSettings = async (key) => {
      const apiKey = await pluginStore.get({ key: key });
      return apiKey;
    };
    const apiKey = await getSquareSettings("squarePk");

    const client = new Client({
      environment: Environment.Sandbox,
      accessToken: apiKey,
    });

    const customersApi = client.customersApi;

    try {
      const { result, ...httpResponse } = await customersApi.createCustomer(
        body
      );

      const { customer } = result;

      ctx.send({
        customer: {
          id: customer.id,
          firstName: customer.givenName,
          lastName: customer.familyName,
          email: customer.emailAddress,
          phone: customer.phoneNumber,
        },
      });
    } catch (error) {
      if (error) {
        ctx.throw(400, error.result);
      }
    }
  },

  createPayment: async (ctx) => {},
};
