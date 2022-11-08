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
export const Languages = {
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
  es: {
    station: ["Estación de ", "Estacion de "],
    centralStation: [],
    halt: ["Apeadero de "],
  },
  en: {
    station: ["railway station", "train station", " station", "Station"],
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
};
