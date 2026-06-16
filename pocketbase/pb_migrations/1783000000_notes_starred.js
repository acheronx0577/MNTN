/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("notes");

    if (collection.fields.getByName("starred")) return;

    collection.fields.add(
      new Field({
        name: "starred",
        type: "bool",
        required: false,
      })
    );
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("notes");
    const field = collection.fields.getByName("starred");

    if (!field) return;

    collection.fields.removeById(field.id);
    app.save(collection);
  }
);
