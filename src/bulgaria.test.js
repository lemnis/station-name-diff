import test from "ava";
import { compare, parse } from "./index.js";

test(`Should match "СОФИЯ" with "Sofia"`, (t) => {
  t.like(parse("СОФИЯ", ["en"]), { normalized: "София" });
  t.like(parse("Sofia", ["en"]), { normalized: "Sofia" });
  t.like(
    compare(
      { name: "СОФИЯ", lang: "en" },
      { name: "Sofia", lang: "en" }
    ),
    { score: 1 }
  );
});