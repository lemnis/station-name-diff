import test from "ava";
import { compare, parse } from "./index.js";

test(`Should match "Berlaimont (Aulnoye)" with "Berlaimont(Aulnoye)"`, (t) => {
  t.like(parse("Berlaimont (Aulnoye)", ["en"]), { normalized: "Berlaimont (Aulnoye)" });
  t.like(parse("Berlaimont(Aulnoye)", ["en"]), { normalized: "Berlaimont (Aulnoye)" });
  t.like(
    compare(
      { name: "Berlaimont (Aulnoye)", lang: "en" },
      { name: "Berlaimont(Aulnoye)", lang: "en" }
    ),
    { score: 1 }
  );
});

test(`Should not match "Berlaimont" with "Berlaimont(Aulnoye)"`, (t) => {
  t.like(parse("Berlaimont", ["en"]), { normalized: "Berlaimont" });
  t.like(parse("Berlaimont(Aulnoye)", ["en"]), { normalized: "Berlaimont (Aulnoye)" });
  t.like(
    compare(
      { name: "Berlaimont", lang: "en" },
      { name: "Berlaimont(Aulnoye)", lang: "en" }
    ),
    { score: 0 }
  );
});

test(`Should not match "Berlaimont" with "Berlaimont (Aulnoye)"`, (t) => {
  t.like(parse("Berlaimont", ["en"]), { normalized: "Berlaimont" });
  t.like(parse("Berlaimont (Aulnoye)", ["en"]), { normalized: "Berlaimont (Aulnoye)" });
  t.like(
    compare(
      { name: "Berlaimont", lang: "en" },
      { name: "Berlaimont (Aulnoye)", lang: "en" }
    ),
    { score: 0 }
  );
});

test(`Should only match "Berlaimont (Aulnoye)" with "Berlaimont" when brackets are ignored`, (t) => {
  t.like(parse("Berlaimont (Aulnoye)", ["en"]), { normalized: "Berlaimont (Aulnoye)" });
  t.like(parse("Berlaimont", ["en"]), { normalized: "Berlaimont" });
  t.like(
    compare(
      { name: "Berlaimont (Aulnoye)", lang: "en" },
      { name: "Berlaimont", lang: "en" }
    ),
    { score: 0 }
  );
  t.like(
    compare(
      { name: "Berlaimont (Aulnoye)", lang: "en" },
      { name: "Berlaimont", lang: "en" },
      { ignoreBrackets: true }
    ),
    { score: 1 }
  );
});

test(`Should match "Avignon (Tgv)" with "Avignon TGV"`, (t) => {
  t.like(parse("Avignon (Tgv)", ["en"]), { normalized: "Avignon (Tgv)" });
  t.like(parse("Avignon TGV", ["en"]), { normalized: "Avignon TGV" });
  t.like(
    compare(
      { name: "Avignon (Tgv)", lang: "en" },
      { name: "Avignon TGV", lang: "en" }
    ),
    { score: 1 }
  );
});

test(`Should match "Paris Gare du Nord" with "Paris Nord"`, (t) => {
  t.like(parse("Paris Gare du Nord", ["fr"]), { normalized: "Paris Gare du Nord" });
  t.like(parse("Paris Nord", ["fr"]), { normalized: "Paris Nord" });
  t.like(
    compare(
      { name: "Paris Gare du Nord", lang: "fr" },
      { name: "Paris Nord", lang: "fr" }
    ),
    { score: 1 }
  );
});

test(`Should match "Paris Gare du Nord" with "Gare de Paris-Nord"`, (t) => {
  t.like(parse("Paris Gare du Nord", ["fr"]), { normalized: "Paris Gare du Nord" });
  t.like(parse("Gare de Paris-Nord", ["fr"]), { normalized: "Gare de Paris-Nord" });
  t.like(
    compare(
      { name: "Paris Gare du Nord", lang: "fr" },
      { name: "Gare de Paris-Nord", lang: "fr" }
    ),
    { score: 1 }
  );
});

test(`Should match "Paris Gare du Nord" with "Gare de Paris-Nord" in English`, (t) => {
  t.like(parse("Paris Gare du Nord", ["en"]), { normalized: "Paris Gare du Nord" });
  t.like(parse("Gare de Paris-Nord", ["en"]), { normalized: "Gare de Paris-Nord" });
  t.like(
    compare(
      { name: "Paris Gare du Nord", lang: "en" },
      { name: "Gare de Paris-Nord", lang: "en" }
    ),
    { score: 1 }
  );
});

test.skip(`Should match "Bourg-St.Maurice" with "Bourg-Saint-Maurice" in English`, (t) => {
  t.like(parse("Bourg-St.Maurice", ["fr"]), { normalized: "Bourg-St.Maurice" });
  t.like(parse("Bourg-Saint-Maurice", ["fr"]), { normalized: "Bourg-Saint-Maurice" });
  t.like(
    compare(
      { name: "Bourg-St.Maurice", lang: "fr" },
      { name: "Bourg-Saint-Maurice", lang: "fr" }
    ),
    { score: 1 }
  );
});
