import { getStore } from "@netlify/blobs";

const COLS = ["expenses", "settles", "cfg"];

export default async (req) => {
  const key = Netlify.env.get("APP_KEY");
  if (key && req.headers.get("x-key") !== key) {
    return new Response("unauthorized", { status: 401 });
  }
  const store = getStore("gastos");

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const out = { expenses: [], settles: [], cfg: null };
    await Promise.all(
      blobs.map(async (b) => {
        const [col, id] = b.key.split("/");
        const v = await store.get(b.key, { type: "json" });
        if (!v) return;
        if (col === "cfg") out.cfg = v;
        else if (out[col]) out[col].push({ ...v, id });
      })
    );
    return Response.json(out);
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
    const { op, col, id, data } = body;
    if (!COLS.includes(col) || !/^[\w-]{1,60}$/.test(id || "")) {
      return new Response("bad request", { status: 400 });
    }
    const k = `${col}/${id}`;
    if (op === "set") {
      if (JSON.stringify(data || {}).length > 20000) return new Response("too large", { status: 413 });
      await store.setJSON(k, data);
    } else if (op === "del") {
      await store.delete(k);
    } else {
      return new Response("bad op", { status: 400 });
    }
    return Response.json({ ok: true });
  }

  return new Response("method not allowed", { status: 405 });
};

export const config = { path: "/api/data" };
