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
      createRule: '@request.auth.id != "" && @request.body.user = @request.auth.id',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    });
    app.save(favorites);

    const notes = new Collection({
      name: "notes",
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
          required: false,
          collectionId: hikes.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: "title", type: "text", required: true, max: 200 },
        { name: "body", type: "text", required: true, max: 10000 },
      ],
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule: '@request.auth.id != "" && @request.body.user = @request.auth.id',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    });
    app.save(notes);

    const contactMessages = new Collection({
      name: "contact_messages",
      type: "base",
      fields: [
        { name: "name", type: "text", required: true, max: 100 },
        { name: "email", type: "email", required: true },
        { name: "subject", type: "text", required: true, max: 200 },
        { name: "message", type: "text", required: true, max: 5000 },
        {
          name: "user",
          type: "relation",
          required: false,
          collectionId: users.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: "status",
          type: "select",
          required: true,
          maxSelect: 1,
          values: ["new", "read"],
        },
        { name: "email_sent", type: "bool", required: true },
      ],
      listRule: null,
      viewRule: null,
      createRule: "",
      updateRule: null,
      deleteRule: null,
    });
    app.save(contactMessages);

    const seedHikes = [
      {
        slug: "get-started",
        title: "Get Started",
        subtitle: "01 GEt Started",
        description:
          "Determining what level of hiker you are can be an important tool when planning future hikes. This hiking level guide will help you plan hikes according to different hike ratings set by various websites like All Trails and Modern Hiker.",
        image: "/images/step-1.png",
        order: 1,
      },
      {
        slug: "hiking-essentials",
        title: "Picking the right Hiking Gear!",
        subtitle: "02 Hiking Essentials",
        description:
          "Determining what level of hiker you are can be an important tool when planning future hikes. This hiking level guide will help you plan hikes according to different hike ratings set by various websites like All Trails and Modern Hiker.",
        image: "/images/step-2.png",
        order: 2,
      },
      {
        slug: "map-timing",
        title: "Understand Your Map & Timing",
        subtitle: "03 where you go is the key",
        description:
          "Determining what level of hiker you are can be an important tool when planning future hikes. This hiking level guide will help you plan hikes according to different hike ratings set by various websites like All Trails and Modern Hiker.",
        image: "/images/step-3.png",
        order: 3,
      },
    ];

    const hikesCollection = app.findCollectionByNameOrId("hikes");
    for (const hike of seedHikes) {
      const record = new Record(hikesCollection);
      record.set("slug", hike.slug);
      record.set("title", hike.title);
      record.set("subtitle", hike.subtitle);
      record.set("description", hike.description);
      record.set("image", hike.image);
      record.set("order", hike.order);
      app.save(record);
    }
  },
  (app) => {
    for (const name of [
      "contact_messages",
      "notes",
      "favorites",
      "hikes",
    ]) {
      try {
        const col = app.findCollectionByNameOrId(name);
        app.delete(col);
      } catch {
        // collection may not exist
      }
    }

    const users = app.findCollectionByNameOrId("users");
    const bio = users.fields.getByName("bio");
    if (bio) {
      users.fields.removeById(bio.id);
      app.save(users);
    }
  }
);
