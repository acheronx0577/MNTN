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