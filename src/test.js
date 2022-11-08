import test from "ava";
import { compare, parse } from "./index.js";

// Estonia
test(`Should not match "Tallinn" with "Rakenduspunkt Balti"`, (t) => {
  t.like(parse("Tallinn", ["nl"]), { normalized: "Tallinn" });
  t.like(parse("Rakenduspunkt Balti", ["nl"]), {
    normalized: "Rakenduspunkt Balti",
  });
  t.like(
    compare(
      { name: "Tallinn", lang: "nl" },
      { name: "Rakenduspunkt Balti", lang: "nl" }
    ),
    {
      score: 0,
    }
  );
});

// Austria
test.skip(`Should match "Hopfgarten im Brixental" with "Hopfgarten/Brixent."`, (t) => {
  t.like(parse("Hopfgarten im Brixental", ["nl"]), {
    normalized: "Hopfgarten im Brixental",
  });
  t.like(parse("Hopfgarten/Brixent.", ["nl"]), {
    normalized: "Hopfgarten/Brixent.",
  });
  t.like(
    compare(
      { name: "Hopfgarten im Brixental", lang: "nl" },
      { name: "Hopfgarten/Brixent.", lang: "nl" }
    ),
    {
      score: 0.5416666666666667,
    }
  );
});

// Germany
test(`Should match "MARIENBERG(SACHS) (Germany)" with "Marienberg (Sachs)"`, (t) => {
  t.like(parse("MARIENBERG(SACHS) (Germany)", ["nl"]), {
    normalized: "Marienberg (Sachs)",
  });
  t.like(parse("Marienberg (Sachs)", ["nl"]), {
    normalized: "Marienberg (Sachs)",
  });
  t.like(
    compare(
      { name: "'MARIENBERG(SACHS) (Germany)", lang: "nl" },
      { name: "'Marienberg (Sachs)", lang: "nl" }
    ),
    { score: 1 }
  );
});

// Luxembourg
test('"Clervaux, Gare" should equal "Clervaux"', (t) => {
  t.like(parse("Clervaux, Gare", ["lu"]), {
    normalized: "Clervaux, Gare",
    simplified: "Clervaux",
    type: "station",
  });

  t.like(parse("Clervaux", ["lu"]), {
    normalized: "Clervaux",
    simplified: "Clervaux",
    type: "station",
  });

  t.like(
    compare(
      { name: "Clervaux, Gare", lang: "lu" },
      { name: "Clervaux", lang: "lu" }
    ),
    {
      score: 1,
    }
  );
});

test('"Luxembourg, Gare Centrale" should equal "Luxembourg"', (t) => {
  t.like(parse("Luxembourg, Gare Centrale", ["lu"]), {
    normalized: "Luxembourg, Gare Centrale",
    simplified: "Luxembourg",
    type: "central",
  });

  t.like(parse("Luxembourg", ["lu"]), {
    normalized: "Luxembourg",
    simplified: "Luxembourg",
    type: "station",
  });

  t.like(
    compare(
      { name: "Luxembourg, Gare Centrale", lang: "lu" },
      { name: "Luxembourg", lang: "lu" }
    ),
    { score: 1 }
  );
});
test('(may change) "Luxembourg, Gare Centrale" should equal "Luxembourg, Gare"', (t) => {
  t.like(parse("Luxembourg, Gare Centrale", ["lu"]), {
    normalized: "Luxembourg, Gare Centrale",
    simplified: "Luxembourg",
    type: "central",
  });

  t.like(parse("Luxembourg, Gare", ["lu"]), {
    normalized: "Luxembourg, Gare",
    simplified: "Luxembourg",
    type: "station",
  });

  t.like(
    compare(
      { name: "Luxembourg, Gare Centrale", lang: "lu" },
      { name: "Luxembourg, Gare", lang: "lu" }
    ),
    { score: 1 }
  );
});
test('"Dudelange, Gare-Burange" should equal "Dudelange-Burange"', (t) => {
  t.like(parse("Dudelange, Gare-Burange", ["lu"]), {
    normalized: "Dudelange, Gare-Burange",
    simplified: "Dudelange-Burange",
    type: "station",
  });

  t.like(parse("Dudelange-Burange", ["lu"]), {
    normalized: "Dudelange-Burange",
    simplified: "Dudelange-Burange",
    type: "station",
  });

  t.like(
    compare(
      { name: "Dudelange, Gare-Burange", lang: "lu" },
      { name: "Dudelange-Burange", lang: "lu" }
    ),
    { score: 1 }
  );
});
test('"Dudelange (Centre), Gare" should not equal "Dudelange (Usines), Gare"', (t) => {
  t.like(parse("Dudelange (Centre), Gare", ["lu"]), {
    normalized: "Dudelange (Centre), Gare",
    simplified: "Dudelange (Centre)",
    type: "station",
  });

  t.like(parse("Dudelange (Usines), Gare", ["lu"]), {
    normalized: "Dudelange (Usines), Gare",
    simplified: "Dudelange (Usines)",
    type: "station",
  });

  t.like(
    compare(
      { name: "Dudelange (Centre), Gare", lang: "lu" },
      { name: "Dudelange (Usines), Gare", lang: "lu" }
    ),
    { score: 0 }
  );
});

test('"Dudelange (Centre), Gare" should equal "Dudelange-Centre"', (t) => {
  t.like(parse("Dudelange (Centre), Gare", ["lu"]), {
    normalized: "Dudelange (Centre), Gare",
    simplified: "Dudelange (Centre)",
    type: "station",
  });

  t.like(parse("Dudelange-Centre", ["lu"]), {
    normalized: "Dudelange-Centre",
    simplified: "Dudelange-Centre",
    type: "station",
  });

  t.like(
    compare(
      { name: "Dudelange (Centre), Gare", lang: "lu" },
      { name: "Dudelange-Centre", lang: "lu" }
    ),
    { score: 1 }
  );
});

// Spain
test.todo('Should match catalan & spanish name "Agurain/salvatierra de alava"');

// Germany
test('Should not match "Hofheim (Ried)" with "Hofheim (Taunus)"', (t) => {
  t.like(parse("Hofheim (Ried)", ["de"]), { normalized: "Hofheim (Ried)" });
  t.like(parse("Hofheim (Taunus)", ["de"]), { normalized: "Hofheim (Taunus)" });
  t.like(
    compare(
      { name: "Hofheim (Ried)", lang: "de" },
      { name: "Hofheim (Taunus)", lang: "de" }
    ),
    {
      score: 0,
    }
  );
});

test('Should not match "Bad Kösen" with "Bad Köstritz"', (t) => {
  t.like(parse("Bad Kösen", ["de"]), { normalized: "Bad Kösen" });
  t.like(parse("Bad Köstritz", ["de"]), { normalized: "Bad Köstritz" });
  t.like(
    compare(
      { name: "Bad Kösen", lang: "de" },
      { name: "Bad Köstritz", lang: "de" }
    ),
    {
      score: 0,
    }
  );
});

// In reality these are different stations located in Germany
test('Should not fully match "Königsborn" with "Königsbornn"', (t) => {
  t.like(parse("Königsborn", ["de"]), { normalized: "Königsborn" });
  t.like(parse("Königsbornn", ["de"]), { normalized: "Königsbornn" });
  t.like(
    compare(
      { name: "Königsborn", lang: "de" },
      { name: "Königsbornn", lang: "de" }
    ),
    {
      score: 0.9166666666666666,
    }
  );
});

test('Should match "Crossen a. d. Elster" with "Crossen an der Elster"', (t) => {
  t.like(parse("Crossen a. d. Elster", ["de"]), {
    normalized: "Crossen a. d. Elster",
  });
  t.like(parse("Crossen an der Elster", ["de"]), {
    normalized: "Crossen an der Elster",
  });
  t.like(
    compare(
      { name: "Crossen a. d. Elster", lang: "de" },
      { name: "Crossen an der Elster", lang: "de" }
    ),
    {
      score: 1,
    }
  );
});

test('Should match "Crossen a. d. Elster" with "Crossen a d Elster"', (t) => {
  t.like(parse("Crossen a. d. Elster", ["de"]), {
    normalized: "Crossen a. d. Elster",
  });
  t.like(parse("Crossen a d Elster", ["de"]), {
    normalized: "Crossen a d Elster",
  });
  t.like(
    compare(
      { name: "Crossen a. d. Elster", lang: "de" },
      { name: "Crossen a d Elster", lang: "de" }
    ),
    {
      score: 1,
    }
  );
});

test('Should have a low match with "Lobenstein (Thür)" with "Bad Lobenstein" when brackets are ignored', (t) => {
  t.like(parse("Lobenstein (Thür)", ["de"]), {
    normalized: "Lobenstein (Thür)",
  });
  t.like(parse("Bad Lobenstein", ["de"]), {
    normalized: "Bad Lobenstein",
  });
  t.like(
    compare(
      { name: "Lobenstein (Thür)", lang: "de" },
      { name: "Bad Lobenstein", lang: "de" },
      { ignoreBrackets: true }
    ),
    {
      score: 0.6785714285714286,
    }
  );
});
test('Should match "Limbach (b Homburg,Saar)" equal to "Limbach (b Homburg/Saar)"', (t) => {
  t.like(parse("Limbach (b Homburg,Saar)", ["de"]), {
    normalized: "Limbach (b Homburg,Saar)",
  });
  t.like(parse("Limbach (b Homburg/Saar)", ["de"]), {
    normalized: "Limbach (b Homburg/Saar)",
  });
  t.like(
    compare(
      { name: "Limbach (b Homburg,Saar)", lang: "de" },
      { name: "Limbach (b Homburg/Saar)", lang: "de" }
    ),
    {
      score: 1,
    }
  );
});
test('Should normalize "Hofheim(Taunus)" to "Hofheim (Taunus)"', (t) => {
  t.like(parse("Hofheim(Taunus)", ["nl"]), { normalized: "Hofheim (Taunus)" });
});

// Diacritics
test('"St. Pölten" should equal "St. Poelten"', (t) => {
  t.like(parse("St. Pölten", ["de"]), {
    normalized: "St. Pölten",
    simplified: "St. Poelten",
    type: "station",
  });

  t.like(parse("St. Poelten", ["de"]), {
    normalized: "St. Poelten",
    simplified: "St. Poelten",
    type: "station",
  });

  t.like(
    compare(
      { name: "St. Pölten", lang: "lu" },
      { name: "St. Poelten", lang: "lu" }
    ),
    {
      score: 1,
    }
  );
});

test('"Wörgl" should equal "Woergl"', (t) => {
  t.like(parse("Wörgl", ["de"]), {
    normalized: "Wörgl",
    simplified: "Woergl",
    type: "station",
  });

  t.like(parse("Woergl", ["de"]), {
    normalized: "Woergl",
    simplified: "Woergl",
    type: "station",
  });

  t.like(
    compare({ name: "Wörgl", lang: "lu" }, { name: "Woergl", lang: "lu" }),
    { score: 1 }
  );
});

test('"Wörgl" should equal "Worgl"', (t) => {
  t.like(parse("Wörgl", ["de"]), {
    normalized: "Wörgl",
    simplified: "Woergl",
    type: "station",
  });

  t.like(parse("Worgl", ["de"]), {
    normalized: "Worgl",
    simplified: "Worgl",
    type: "station",
  });

  t.like(
    compare({ name: "Wörgl", lang: "lu" }, { name: "Worgl", lang: "lu" }),
    { score: 0.75 }
  );
});

// Language specifics
test("Should match names in different languages in same script (latin)", (t) => {
  t.like(parse("station Kufstein", ["nl"]), { normalized: "station Kufstein" });
  t.like(parse("gare de Kufstein", ["fr"]), { normalized: "gare de Kufstein" });
  t.like(
    compare(
      { name: "station Kufstein", lang: "nl" },
      { name: "gare de Kufstein", lang: "fr" }
    ),
    {
      score: 1,
    }
  );
});

test("Should not match names in different languages in different script", (t) => {
  t.like(parse("デュッセルドルフ空港", ["nl"]), {
    normalized: "デュッセルドルフ空港",
  });
  t.like(parse("Düsseldorf Flughafen Terminal S", ["nl"]), {
    normalized: "Düsseldorf Flughafen Terminal S",
  });
  t.like(
    compare(
      { name: "デュッセルドルフ空港", lang: "nl" },
      { name: "Düsseldorf Flughafen Terminal S", lang: "nl" }
    ),
    {
      score: 0,
      reason: "Incompatible script",
    }
  );
});
