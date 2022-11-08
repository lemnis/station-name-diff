import test from "ava";
import { compare, parse } from "./index.js";

test(`Should not match "Helmond Brandevoort" with "Helmond Brouwhuis"`, (t) => {
  t.like(parse("Helmond Brandevoort", ["nl"]), { normalized: "Helmond Brandevoort" });
  t.like(parse("Helmond Brouwhuis", ["nl"]), { normalized: "Helmond Brouwhuis" });
  t.like(
    compare(
      { name: "Helmond Brandevoort", lang: "nl" },
      { name: "Helmond Brouwhuis", lang: "nl" }
    ),
    {
      score: 0,
    }
  );
});

test(`Should match "'t Harde" with "Harde ('t)"`, (t) => {
  t.like(parse("'t Harde", ["nl"]), { normalized: "'t Harde" });
  t.like(parse("Harde ('t)", ["nl"]), { normalized: "Harde ('t)" });
  t.like(
    compare(
      { name: "'t Harde", lang: "nl" },
      { name: "Harde ('t)", lang: "nl" }
    ),
    {
      score: 1,
    }
  );
});

test(`Should match "'s-Hertogenbosch" with "'s Hertogenbosch"`, (t) => {
  t.like(parse("'s-Hertogenbosch", ["nl"]), { normalized: "'s-Hertogenbosch" });
  t.like(parse("'s Hertogenbosch", ["nl"]), { normalized: "'s Hertogenbosch" });
  t.like(
    compare(
      { name: "'s-Hertogenbosch", lang: "nl" },
      { name: "'s Hertogenbosch", lang: "nl" }
    ),
    {
      score: 1,
    }
  );
});
test(`Should partially match "Houthem-St. Gerlach" with "Houthem Sint Gerlach"`, (t) => {
  t.like(parse("Houthem-St. Gerlach", ["nl"]), {
    normalized: "Houthem-St. Gerlach",
  });
  t.like(parse("Houthem Sint Gerlach", ["nl"]), {
    normalized: "Houthem Sint Gerlach",
  });
  t.like(
    compare(
      { name: "Houthem-St. Gerlach", lang: "nl" },
      { name: "Houthem Sint Gerlach", lang: "nl" }
    ),
    {
      score: 0.7916666666666666,
    }
  );
});
test(`Should not match "Houthem-St. Gerlach" with " Houthem station Gerlach`, async (t) => {
  t.like(parse("Houthem-St. Gerlach", ["nl"]), {
    normalized: "Houthem-St. Gerlach",
  });
  t.like(parse("Houthem station Gerlach", ["nl"]), {
    normalized: "Houthem station Gerlach",
  });
  t.like(
    compare(
      { name: "Houthem-St. Gerlach", lang: "nl" },
      { name: "Houthem station Gerlach", lang: "nl" }
    ),
    {
      score: 0,
    }
  );
});