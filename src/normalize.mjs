import { feature } from "@ideditor/country-coder";
import he from "he";

const SimilarCharacters = [
  {
    replaceValue: "-",
    characters: ["—", "–"],
  },
  {
    replaceValue: "'",
    characters: ["’"],
  },
  {
    replaceValue: '"',
    characters: [],
  },
];

function findMatches(regex, str, matches = []) {
  const res = regex.exec(str);
  res && matches.push(res) && findMatches(regex, str, matches);
  return matches;
}

/**
 * Returns a minimal normalized name, see tests for examples
 * @param {string} name
 */
export const normalize = (name) => {
  let normalized = name;

  if (!normalized) return "";

  normalized = he.decode(name);

  const charactersTillFirstBrackets = name.split("(")[0];
  const nameIsUppercase =
    charactersTillFirstBrackets === charactersTillFirstBrackets.toUpperCase();

  SimilarCharacters.forEach(({ replaceValue, characters }) => {
    if (normalized) {
      const regexp = new RegExp(`[${characters.join("")}]`, "g");
      normalized = normalized.replace(regexp, replaceValue);
    }
  });

  if (nameIsUppercase) {
    normalized = normalized.toLowerCase();
    const letters = normalized.match(/(\b|^)./g);
    letters
      ?.filter((i) => i)
      .forEach((letter) => {
        const letterMatch = new RegExp(
          "(\\b|^)" +
            ([".", "?", "(", ")", "+", "|", "^", "$"].includes(letter)
              ? "\\"
              : "") +
            letter
        );
        normalized = normalized.replace(letterMatch, letter?.toUpperCase());
      });
  }

  const constainsBrackets = normalized
    .match(/\((.+?)\)/g)
    ?.map((full) => full.slice(1, -1));

  constainsBrackets?.forEach((substring) => {
    const level = feature(substring)?.properties.level;
    if (level && ["country", "territory"].includes(level)) {
      normalized = normalized.replace(`(${substring})`, "");
    }
  });

  return normalized
    .replace(/ +/g, " ")
    .replace(/(\w)\(/, "$1 (")
    .trim();
};
