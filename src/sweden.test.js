import test from "ava";
import { compare, parse } from "./index.js";

test(`Should match "Mjoelby Station" with "Mjoelby"`, (t) => {
  t.like(parse("Mjoelby Station", ["en"]), { normalized: "Mjoelby Station" });
  t.like(parse("Mjoelby", ["en"]), { normalized: "Mjoelby" });
  t.like(
    compare(
      { name: "Mjoelby Station", lang: "en" },
      { name: "Mjoelby", lang: "en" }
    ),
    { score: 1 }
  );
});

test(`Should match "Mjoelby Station" with "Mjölby"`, (t) => {
  t.like(parse("Mjoelby Station", ["en"]), { normalized: "Mjoelby Station" });
  t.like(parse("Mjölby", ["en"]), { normalized: "Mjölby" });
  t.like(
    compare(
      { name: "Mjoelby Station", lang: "en" },
      { name: "Mjölby", lang: "en" }
    ),
    { score: 1 }
  );
});

test(`Should match "Norrköping Central" with "Norrkoepings central"`, (t) => {
  t.like(parse("Norrköping Central", ["en"]), { normalized: "Norrköping Central" });
  t.like(parse("Norrkoepings central", ["en"]), { normalized: "Norrkoepings central" });
  t.like(
    compare(
      { name: "Norrköping Central", lang: "en" },
      { name: "Norrkoepings central", lang: "en" }
    ),
    { score: 0.9166666666666666 }
  );
});

test(`Should match "Ånge" with "Aange"`, (t) => {
  t.like(parse("Ånge", ["en"]), { normalized: "Ånge" });
  t.like(parse("Aange", ["en"]), { normalized: "Aange" });
  t.like(
    compare(
      { name: "Ånge", lang: "en" },
      { name: "Aange", lang: "en" }
    ),
    { score: 1 }
  );
});
