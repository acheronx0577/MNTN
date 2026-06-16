/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    const notes = app.findCollectionByNameOrId("notes");

    if (app.findCollectionByNameOrId("note_favorites")) return;

    const noteFavorites = new Collection({
      name: "note_favorites",
      type: "base",
      fields: [
        {
          name: "user",
          type: "relation",
          required: true,
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: "note",
          type: "relation",
          required: true,
          collectionId: notes.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
      ],
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule:
        '@request.auth.id != "" && @request.body.user = @request.auth.id',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    });

    app.save(noteFavorites);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("note_favorites");
    if (collection) app.delete(collection);
  }
);
