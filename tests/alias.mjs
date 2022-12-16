import test from "ava";
import { getAlias } from "../src/alias.mjs";
import { compare, compareWithAlias, parse } from "../src/index.mjs";

test(`Should match "Ypres" with "Ieper"`, async (t) => {
  t.like(
    await compareWithAlias(
      { name: "Ypres", lang: "en" },
      { name: "Ieper", lang: "en" }
    ),
    { score: 1 }
  );
});

test(`Should match "'s-Hertogenbosch" with "Den Bosch"`, async (t) => {
  t.like(
    await compareWithAlias(
      { name: "'s-Hertogenbosch", lang: "en" },
      { name: "Den Bosch", lang: "en" }
    ),
    { score: 1 }
  );
});
