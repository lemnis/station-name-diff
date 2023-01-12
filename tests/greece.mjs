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

test(`Should partially match "σιδηροδρομικός σταθμός Τσουκαλαίικων" with "Tsoukaleikon treinstation"`, (t) => {
  t.like(parse("σιδηροδρομικός σταθμός Τσουκαλαίικων", ["en"]), { normalized: "σιδηροδρομικός σταθμός Τσουκαλαίικων" });
  t.like(parse("Tsoukaleikon treinstation", ["en"]), { normalized: "Tsoukaleikon treinstation" });
  t.is(
    compare(
      { name: "σιδηροδρομικός σταθμός Τσουκαλαίικων", lang: "gr" },
      { name: "Tsoukaleikon treinstation", lang: "en" }
    ),
    { score: 0.9 }
  );
});

test(`Should partially match "σιδηροδρομικός σταθμός Τσουκαλαίικων" with "σιδηροδρομικός σταθμός Τσουκαλαίικων"`, (t) => {
  t.like(parse("σιδηροδρομικός σταθμός Τσουκαλαίικων", ["en"]), { normalized: "σιδηροδρομικός σταθμός Τσουκαλαίικων" });
  t.like(parse("σιδηροδρομικός σταθμός Τσουκαλαίικων", ["en"]), { normalized: "σιδηροδρομικός σταθμός Τσουκαλαίικων" });
  t.is(
    compare(
      { name: "σιδηροδρομικός σταθμός Τσουκαλαίικων", lang: "gr" },
      { name: "σιδηροδρομικός σταθμός Τσουκαλαίικων", lang: "en" }
    ),
    { score: 1 }
  );
});