"use strict";
const controllerUtils = require("../../utils/index");
const acuity = require("acuityscheduling");
/**
 * acuity.js controller
 *
 * @description: A set of functions called "actions" of the `acuity` plugin.
 */

module.exports = {
  /**
   * Default action.
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

    const getAcuitySettings = async (key1, key2) => {
      const pk = await pluginStore.get({ key: key1 });
      const userId = await pluginStore.get({ key: key2 });

      return {
        pk,
        userId,
      };
    };
    const { pk, userId } = await getAcuitySettings("pk", "userId");

    ctx.send({
      pk: pk ? pk : "",
      userId: userId ? userId : "",
    });
  },
  updateSettings: async (ctx) => {
    const { user } = ctx.state;
    const { userId, pk } = ctx.request.body;

    // make sure user is admin
    if (user.roles[0].name !== "Super Admin") {
      return ctx.unauthorized("Only administrators allowed!");
    }

    if (!pk || !userId) {
      return ctx.throw(400, "Please make sure all fields are filled correctly");
    }
    const pluginStore = controllerUtils.getStore();

    const setValues = async (key, id) => {
      await pluginStore.set({ key: "pk", value: key });
      await pluginStore.set({ key: "userId", value: id });
    };

    const result = await setValues(pk, userId);

    ctx.send({
      result,
    });
  },
  getAppointments: async (ctx) => {
    const pluginStore = controllerUtils.getStore();

    const getAcuitySettings = async (key1, key2) => {
      const pk = await pluginStore.get({ key: key1 });
      const userId = await pluginStore.get({ key: key2 });

      return {
        pk,
        userId,
      };
    };
    const { pk, userId } = await getAcuitySettings("pk", "userId");

    const { body } = ctx.request;
    const { session } = ctx.session;
    const Acuity = acuity.basic({
      userId,
      apiKey: pk,
    });
    // const appointmentType = null;
    // const appointmentTypes = session?.appointmentTypes || null;
    // const appointmentTypeId = (session?.appointmentTypeID =
    //   body?.appointmentTypeID || session?.appointmentTypeID || null);
    // const date = (session?.date = body?.date || session?.date || null);
    // const time = (session?.time = body?.time || session?.time || null);

    return Acuity.request(
      "/appointment-types",
      function (err, res, appointmentTypes) {
        ctx.send({ appointmentTypes });
      }
    );
  },
  getAppointmentAddons: async (ctx) => {
    const pluginStore = controllerUtils.getStore();

    const getAcuitySettings = async (key1, key2) => {
      const pk = await pluginStore.get({ key: key1 });
      const userId = await pluginStore.get({ key: key2 });

      return {
        pk,
        userId,
      };
    };
    const { pk, userId } = await getAcuitySettings("pk", "userId");

    const { body } = ctx.request;
    const { session } = ctx.session;
    const Acuity = acuity.basic({
      userId,
      apiKey: pk,
    });
    // Add your own logic here.
    return Acuity.request(
      "/appointment-addons",
      function (err, res, appointmentAddons) {
        ctx.send({ appointmentAddons });
      }
    );
  },
  appointmentDates: async (ctx) => {
    const pluginStore = controllerUtils.getStore();

    const getAcuitySettings = async (key1, key2) => {
      const pk = await pluginStore.get({ key: key1 });
      const userId = await pluginStore.get({ key: key2 });

      return {
        pk,
        userId,
      };
    };
    const { pk, userId } = await getAcuitySettings("pk", "userId");

    const { body } = ctx.request;
    const { session } = ctx.session;
    const Acuity = acuity.basic({
      userId,
      apiKey: pk,
    });
    // Add your own logic here.
    const parameterizeArray = (key, arr) => {
      arr = arr.map(encodeURIComponent);
      return "?" + key + "[]=" + arr.join("&" + key + "[]=");
    };

    return Acuity.request(
      `/availability/dates?month=${body.month}&appointmentTypeID=${
        body.appointmentTypeId
      }&${parameterizeArray("addonIDs", body.addonIDs)}`,
      function (err, res, appointmentDates) {
        console.log("line 161 req body", body);
        console.log("line 161 appt dates res", appointmentDates);
        ctx.send({ appointmentDates });
      }
    );
  },
  appointmentTimes: async (ctx) => {
    const pluginStore = controllerUtils.getStore();

    const getAcuitySettings = async (key1, key2) => {
      const pk = await pluginStore.get({ key: key1 });
      const userId = await pluginStore.get({ key: key2 });

      return {
        pk,
        userId,
      };
    };
    const { pk, userId } = await getAcuitySettings("pk", "userId");

    const { body } = ctx.request;
    const { session } = ctx.session;
    const Acuity = acuity.basic({
      userId,
      apiKey: pk,
    });
    // Add your own logic here.
    const parameterizeArray = (key, arr) => {
      arr = arr.map(encodeURIComponent);
      return "?" + key + "[]=" + arr.join("&" + key + "[]=");
    };

    return Acuity.request(
      `/availability/times?date=${body.date}&appointmentTypeID=${
        body.appointmentTypeId
      }&${parameterizeArray("addonIDs", body.addonIDs)}`,
      function (err, res, appointmentTimes) {
        ctx.send({ appointmentTimes });
      }
    );
  },
  createAppointment: async (ctx) => {
    // Add your own logic here.
    const pluginStore = controllerUtils.getStore();

    const getAcuitySettings = async (key1, key2) => {
      const pk = await pluginStore.get({ key: key1 });
      const userId = await pluginStore.get({ key: key2 });

      return {
        pk,
        userId,
      };
    };
    const { pk, userId } = await getAcuitySettings("pk", "userId");

    const { body } = ctx.request;

    const Acuity = acuity.basic({
      userId,
      apiKey: pk,
    });
    const options = {
      method: "POST",
      body,
    };
    return Acuity.request(
      "/appointments",
      options,
      function (err, res, appointment) {
        ctx.send({
          appointment: JSON.stringify(appointment, null, "  "),
        });
      }
    );
  },
};
