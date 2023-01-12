'use strict';

var diacritics = require('diacritics');
var wuzzy = require('wuzzy');
var countryCoder = require('@ideditor/country-coder');
var he = require('he');

/**
 * @type {{
 *  [key: string]: {
 *    station: string[],
 *    centralStation: string[],
 *    halt: string[],
 *    typeOfTransport?: { type: ('light rail' | 'high speed' | 'metro')[], names: string[] }[]
 *    abbreviations?: { simplified: string, variants: string[] }[]
 *  }
 * }}
 */
const Languages = {
  bg: {
    station: ["Железопътна гара"],
    centralStation: [],
    halt: [],
  },
  da: {
    station: ["Station"],
    centralStation: [],
    halt: [],
  },
  de: {
    station: ["Bf", "Bahnhof"],
    centralStation: ["Hbf", "Hauftbahnhof"],
    halt: ["Haltpunkt"],
    typeOfTransport: [
      {
        type: ["light rail", "metro"],
        names: ["(S+U)"],
      },
      {
        type: ["metro"],
        names: ["(U)"],
      },
      {
        type: ["light rail"],
        names: ["(S)", "S-Bahnhof"],
      },
    ],
    abbreviations: [
      {
        simplified: "an der ",
        variants: ["a d ", "a. d. "],
      },
    ],
  },
  pt: {
    station: ["Estádio do "],
    centralStation: [],
    halt: ["Apeadeiro de "],
  },
  es: {
    station: ["Estación de ", "Estacion de "],
    centralStation: [],
    halt: ["Apeadero de "],
  },
  en: {
    station: ["railway station", "train station", " station", "Station", "Railway Station"],
    centralStation: ["Central", " central"],
    halt: ["railway stop", "halt"],
    abbreviations: [
      {
        simplified: " International",
        variants: [" Intl"],
      },
      // {
      //   simplified: " Sint ",
      //   variants: [" St.", " St "],
      // },
      // {
      //   simplified: "Sint ",
      //   variants: ["St.", "St "],
      // },
    ],
  },
  fr: {
    station: ["gare de", "Gare du", "Gare de", "gare du"],
    centralStation: [],
    halt: [],
    typeOfTransport: [
      {
        type: ["light rail"],
        names: ["RER"],
      },
      {
      type: ["high speed"],
        names: ["TGV"],
      },
    ],
  },
  it: {
    station: ["stazione di"],
    centralStation: [],
    halt: [],
  },
  lu: {
    station: [", Gare"],
    centralStation: [", Gare Centrale"],
    halt: [],
  },
  nb: {
    station: ["stasjon"],
    centralStation: [],
    halt: [],
  },
  nl: {
    station: ["station"],
    centralStation: ["centraal", "CS"],
    halt: ["halte"],
    // abbreviations: [
    //   {
    //     simplified: "Sint",
    //     variants: ["St."],
    //   },
    // ],
  },
  se: {
    station: ["Station"],
    centralStation: ["centralstation", "central"],
    halt: [],
  },
  hu: {
    station: ["vasutallomas"],
    centralStation: [],
    halt: [],
  },
  ro: {
    station: ["gara "],
    centralStation: [],
    halt: ["halta "],
  },
};

// Transform german characters
Object.assign(diacritics.diacriticsMap, {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  å: "aa",
  Å: "Aa",
  ø: "oe",
  Ø: "Oe",
});

const convertCyrillicToLatin = function(string) {
  var cyrillic = 'А_Б_В_Г_Д_Ђ_Е_Ё_Ж_З_И_Й_Ј_К_Л_Љ_М_Н_Њ_О_П_Р_С_Т_Ћ_У_Ф_Х_Ц_Ч_Џ_Ш_Щ_Ъ_Ы_Ь_Э_Ю_Я_а_б_в_г_д_ђ_е_ё_ж_з_и_й_ј_к_л_љ_м_н_њ_о_п_р_с_т_ћ_у_ф_х_ц_ч_џ_ш_щ_ъ_ы_ь_э_ю_я'.split('_');
  var latin = 'A_B_V_G_D_Đ_E_Ë_Ž_Z_I_J_J_K_L_Lj_M_N_Nj_O_P_R_S_T_Ć_U_F_H_C_Č_Dž_Š_Ŝ_ʺ_Y_ʹ_È_Û_Â_a_b_v_g_d_đ_e_ë_ž_z_i_j_j_k_l_lj_m_n_nj_o_p_r_s_t_ć_u_f_h_c_č_dž_š_ŝ_ʺ_y_ʹ_è_û_â'.split('_');

  return string.split('').map(function(char) {
    var index = cyrillic.indexOf(char);
    if (!~index)
      return char
    return latin[index]
  }).join('')
};

const latinPattern = /\p{Script=Latin}/u;
const cyrillicPattenr = /\p{Script=Cyrillic}/u;

/** @param {string} name */
const containsLatin = (name) => latinPattern.test(name);

/** @param {string} name */
const containsCyrillic = (name) => cyrillicPattenr.test(name);

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

/**
 * Returns a minimal normalized name, see tests for examples
 * @param {string} name
 */
const normalize = (name) => {
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
    const level = countryCoder.feature(substring)?.properties.level;
    if (level && ["country", "territory"].includes(level)) {
      normalized = normalized.replace(`(${substring})`, "");
    }
  });

  return normalized
    .replace(/ +/g, " ")
    .replace(/(\w)\(/, "$1 (")
    .trim();
};

/// <reference path="../module.d.ts" />

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
const parse = (name, languages = [], coordinates = undefined) => {
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
const compare = (a, b, { ignoreBrackets = false } = {}) => {
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
      newASplit.length > bSplit.length
        ? [newASplit, bSplit]
        : [bSplit, newASplit];

    const firstMismatchIndex = long.findIndex((a, i) => a !== short[i]);

    const aJoined = newASplit.slice(firstMismatchIndex).join(" ");
    const bJoined = bSplit.slice(firstMismatchIndex).join(" ");

    const newDistance = wuzzy.ngram(aJoined, bJoined);
    if (newDistance > distance)
      score =
        firstMismatchIndex < 0 ? 1 : distance > MINIMUM_DISTANCE ? distance : 0;
  }

  if (score < 1 && bSimplified?.match(/\(/)) {
    const newBSplit = [bSplit[bSplit.length - 1], ...bSplit.slice(0, -1)];

    const [long, short] =
      aSplit.length > newBSplit.length
        ? [aSplit, newBSplit]
        : [newBSplit, aSplit];

    const firstMismatchIndex = long.findIndex((a, i) => a !== short[i]);

    const aJoined = aSplit.slice(firstMismatchIndex).join(" ");
    const bJoined = newBSplit.slice(firstMismatchIndex).join(" ");

    const newDistance = wuzzy.ngram(aJoined, bJoined);
    if (newDistance > distance)
      score =
        firstMismatchIndex < 0 ? 1 : distance > MINIMUM_DISTANCE ? distance : 0;
  }

  return { score };
};

exports.compare = compare;
exports.normalize = normalize;
exports.parse = parse;
