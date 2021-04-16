module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        database: "fem",
        uri: env("DATABASE_URI"),
      },
      options: {
        ssl: true,
      },
    },
  },
});