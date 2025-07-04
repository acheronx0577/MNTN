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