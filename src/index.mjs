/// <reference path="../module.d.ts" />

import { Languages } from "./language.data.mjs";
import {
  diacritics,
  containsCyrillic,
  convertCyrillicToLatin,
  containsLatin,
} from "./script.mjs";
import wuzzy from "wuzzy";
import { normalize } from "./normalize.mjs";

const Type = {
  STATION: "station",
  CENTRAL_STATION: "central",
  HALT: "halt",
};

const Reason = {
  SCRIPT: "Incompatible script",
};

const MINIMUM_DISTANCE = 0.66;

const stationStrings = Array.from(
  new Set(
    Object.values(Languages)
      .map((lang) => [...lang?.centralStation, ...lang?.station, ...lang?.halt])
      .flat()
      .filter(Boolean)
  )
)
  .sort((a, b) => b.localeCompare(a))
  .sort((a, b) => b.length - a.length);

/**
 * @param {string} name
 * @param {string[]} languages
 * @param {[number, number] | undefined} coordinates
 */
export const parse = (name, languages = [], coordinates = undefined) => {
  const normalized = normalize(name);

  // Simplify
  /** @type {string} */
  let simplified = diacritics.remove(normalized);
  stationStrings.forEach((str) => {
    if (simplified.includes(str)) simplified = simplified.replace(str, "");
  });

  languages.forEach((language) => {
    Languages[language]?.abbreviations?.forEach((abbr) => {
      abbr.variants.forEach((str) => {
        if (simplified.includes(str))
          simplified = simplified.replace(str, abbr.simplified);
      });
    });
  });

  simplified = simplified.replace(/ +/g, " ").trim();

  let type = Type.STATION;
  languages.forEach((language) => {
    if (
      Languages[language]?.centralStation.some((str) =>
        normalized.includes(str)
      )
    ) {
      type = Type.CENTRAL_STATION;
    }
  });

  return { normalized, simplified, type };
};

/**
 * @param {{ name: string, lang: string }} a
 * @param {{ name: string, lang: string }} b
 * @param {{ ignoreBrackets?: boolean }} options
 */
export const compare = (a, b, { ignoreBrackets = false } = {}) => {
  if (containsCyrillic(a.name)) a.name = convertCyrillicToLatin(a.name);
  if (containsCyrillic(b.name)) b.name = convertCyrillicToLatin(b.name);

  if (!containsLatin(a.name) || !containsLatin(b.name)) {
    if (a.name === b.name) return { score: 1 };
    else return { score: 0, reason: Reason.SCRIPT };
  }

  const { simplified: aSimplified, ...aFoo } = parse(
    ignoreBrackets ? a.name.replace(/\(.*?\)/, "") : a.name,
    [a.lang]
  );
  const { simplified: bSimplified, ...bFoo } = parse(
    ignoreBrackets ? b.name.replace(/\(.*?\)/, "") : b.name,
    [b.lang]
  );

  const aSplit = aSimplified
    .split(/[ ()-\/]/)
    .filter(Boolean)
    .map((i) => i.toLowerCase());
  const bSplit = bSimplified
    .split(/[ ()-\/]/)
    .filter(Boolean)
    .map((i) => i.toLowerCase());

  const [long, short] =
    aSplit.length > bSplit.length ? [aSplit, bSplit] : [bSplit, aSplit];

  const firstMismatchIndex = long.findIndex((a, i) => a !== short[i]);

  const aJoined = aSplit.slice(firstMismatchIndex).join(" ");
  const bJoined = bSplit.slice(firstMismatchIndex).join(" ");

  const distance = wuzzy.ngram(aJoined, bJoined);

  let score =
    firstMismatchIndex < 0 ? 1 : distance > MINIMUM_DISTANCE ? distance : 0;

  if (score < 1 && aSimplified?.match(/\(/)) {
    const newASplit = [aSplit[aSplit.length - 1], ...aSplit.slice(0, -1)];

    const [long, short] =
      newASplit.length > bSplit.length ? [newASplit, bSplit] : [bSplit, newASplit];

    const firstMismatchIndex = long.findIndex((a, i) => a !== short[i]);

    const aJoined = newASplit.slice(firstMismatchIndex).join(" ");
    const bJoined = bSplit.slice(firstMismatchIndex).join(" ");

    const newDistance = wuzzy.ngram(aJoined, bJoined);
    if(newDistance > distance) score =
    firstMismatchIndex < 0 ? 1 : distance > MINIMUM_DISTANCE ? distance : 0;
  }

  if (score < 1 && bSimplified?.match(/\(/)) {
    const newBSplit = [bSplit[bSplit.length - 1], ...bSplit.slice(0, -1)];

    const [long, short] =
      aSplit.length > newBSplit.length ? [aSplit, newBSplit] : [newBSplit, aSplit];

    const firstMismatchIndex = long.findIndex((a, i) => a !== short[i]);

    const aJoined = aSplit.slice(firstMismatchIndex).join(" ");
    const bJoined = newBSplit.slice(firstMismatchIndex).join(" ");

    const newDistance = wuzzy.ngram(aJoined, bJoined);
    if(newDistance > distance) score =
    firstMismatchIndex < 0 ? 1 : distance > MINIMUM_DISTANCE ? distance : 0;
  }

  return { score };
};

export { normalize };