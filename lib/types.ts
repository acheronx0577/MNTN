export type Hike = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  difficulty?: string;
  order: number;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  hike?: string;
  created: string;
  updated: string;
};

export type ContactResult =
  | { ok: true; partial?: boolean }
  | { ok: false; error?: string };

export type ActionResult =
  | { ok: true }
  | { ok: false; error?: string };
