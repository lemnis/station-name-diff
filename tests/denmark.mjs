import test from "ava";
import { compare, parse } from "../src/index.mjs";

test.skip(`Should match "Høje Taastrup St." with "Høje Taastrup Station"`, async (t) => {
  t.like(parse("Høje Taastrup St.", ["en"]), { normalized: "Høje Taastrup St." });
  t.like(parse("Høje Taastrup Station", ["en"]), { normalized: "Høje Taastrup St." });
  t.like(
    await compare(
      { name: "Høje Taastrup St.", lang: "en" },
      { name: "Høje Taastrup Station", lang: "en" }
    ),
    { score: 1 }
  );
});
