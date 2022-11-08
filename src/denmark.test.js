import test from "ava";
import { compare, parse } from "./index.js";

test.skip(`Should match "Høje Taastrup St." with "Høje Taastrup Station"`, (t) => {
  t.like(parse("Høje Taastrup St.", ["en"]), { normalized: "Høje Taastrup St." });
  t.like(parse("Høje Taastrup Station", ["en"]), { normalized: "Høje Taastrup St." });
  t.like(
    compare(
      { name: "Høje Taastrup St.", lang: "en" },
      { name: "Høje Taastrup Station", lang: "en" }
    ),
    { score: 1 }
  );
});
