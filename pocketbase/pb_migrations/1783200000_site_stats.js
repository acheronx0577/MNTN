/// <reference path="../pb_data/types.d.ts" />

function collectionExists(app, name) {
  try {
    app.findCollectionByNameOrId(name);
    return true;
  } catch {
    return false;
  }
}

function globalStatsRecordExists(app) {
  try {
    app.findFirstRecordByFilter("site_stats", `key = "global"`);
    return true;
  } catch {
    return false;
  }
}

migrate(
  (app) => {
    if (!collectionExists(app, "site_stats")) {
      const siteStats = new Collection({
        name: "site_stats",
        type: "base",
        fields: [
          { name: "key", type: "text", required: true, unique: true },
          { name: "views", type: "number", required: false, min: 0 },
        ],
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
      });

      app.save(siteStats);
    }

    if (globalStatsRecordExists(app)) return;

    const collection = app.findCollectionByNameOrId("site_stats");
    const record = new Record(collection);
    record.set("key", "global");
    record.set("views", 0);
    app.save(record);
  },
  (app) => {
    if (!collectionExists(app, "site_stats")) return;
    app.delete(app.findCollectionByNameOrId("site_stats"));
  }
);
