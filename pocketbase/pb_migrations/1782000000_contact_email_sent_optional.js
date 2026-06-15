/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("contact_messages");
    const field = collection.fields.getByName("email_sent");

    if (!field) return;

    field.required = false;
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("contact_messages");
    const field = collection.fields.getByName("email_sent");

    if (!field) return;

    field.required = false;
    app.save(collection);
  }
);
