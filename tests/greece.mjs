import test from "ava";
import { compare, parse } from "../src/index.mjs";

test(`Should partially match "Agios Vasileios railway station" with "Agios Vassileios"`, (t) => {
  t.like(parse("Agios Vasileios railway station", ["en"]), { normalized: "Agios Vasileios railway station" });
  t.like(parse("Agios Vassileios", ["en"]), { normalized: "Agios Vassileios" });
  t.like(
    compare(
      { name: "Agios Vasileios railway station", lang: "en" },
      { name: "Agios Vassileios", lang: "en" }
    ),
    { score: 0.9 }
  );
});