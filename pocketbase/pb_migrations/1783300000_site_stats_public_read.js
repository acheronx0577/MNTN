/// <reference path="../pb_data/types.d.ts" />

function collectionExists(app, name) {
  try {
    app.findCollectionByNameOrId(name);
    return true;
  } catch {
    return false;
  }
}

migrate(
  (app) => {
    if (!collectionExists(app, "site_stats")) return;

    const siteStats = app.findCollectionByNameOrId("site_stats");
    siteStats.listRule = "";
    siteStats.viewRule = "";
    app.save(siteStats);
  },
  (app) => {
    if (!collectionExists(app, "site_stats")) return;

    const siteStats = app.findCollectionByNameOrId("site_stats");
    siteStats.listRule = null;
    siteStats.viewRule = null;
    app.save(siteStats);
  }
);
