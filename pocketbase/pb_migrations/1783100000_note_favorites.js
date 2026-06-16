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
    if (collectionExists(app, "note_favorites")) return;

    const users = app.findCollectionByNameOrId("users");
    const notes = app.findCollectionByNameOrId("notes");

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
    if (!collectionExists(app, "note_favorites")) return;
    app.delete(app.findCollectionByNameOrId("note_favorites"));
  }
);
