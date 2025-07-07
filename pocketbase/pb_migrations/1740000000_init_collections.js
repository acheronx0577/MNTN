/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    if (!users.fields.getByName("bio")) {
      users.fields.add(
        new Field({
          name: "bio",
          type: "text",
          required: false,
          max: 1000,
        })
      );
      app.save(users);
    }

    const hikes = new Collection({
      name: "hikes",
      type: "base",
      fields: [
        { name: "slug", type: "text", required: true, unique: true },
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text", required: true },
        { name: "description", type: "text", required: true },
        { name: "image", type: "text", required: true },
        { name: "difficulty", type: "text", required: false },
        { name: "order", type: "number", required: true },
      ],
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    app.save(hikes);

    const favorites = new Collection({
      name: "favorites",
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
          name: "hike",
          type: "relation",
          required: true,
          collectionId: hikes.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
      ],
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule: '@request.auth.id != "" && @request.data.user = @request.auth.id',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    });
    app.save(favorites);
