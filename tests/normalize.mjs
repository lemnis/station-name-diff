import test from "ava";
import { normalize } from "../src/normalize.mjs";

test("Should tremove spaces at end and start", (t) =>
  t.is(normalize("  foo  "), "foo"));
test("Should add space before bracket", (t) =>
  t.is(normalize("a(b)"), "a (b)"));

test("Should transform full uppercase names", (t) =>
  t.is(normalize("BOLOGNA C.LE/AV"), "Bologna C.Le/Av"));

test("Should remove country name", (t) =>
  t.is(normalize("BOLOGNA (France)"), "Bologna"));

test("Should remove duplicate spaces", (t) =>
  t.is(normalize("  fo   o  "), "fo o"));

test("Should replace long dash to regular dash, – to -", (t) =>
  t.is(normalize("Chaumont–sur—Loire"), "Chaumont-sur-Loire"));

test("Should replace ’ to '", (t) => t.is(normalize("A’b"), "A'b"));

test("Should convert html entities to unicode’ to '", (t) =>
  t.is(normalize("&#x0028;foo&#x0029;"), "(foo)"));

test(`Should remove territory name`, (t) => {
  t.is(normalize("MARIENBERG (Netherlands)"), "Marienberg");
});

test(`Should remove country name in second bracket`, (t) => {
  t.is(normalize("MARIENBERG(SACHS) (Germany)"), "Marienberg (Sachs)");
});
