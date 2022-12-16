export function normalize(name: string): string;

export function parse(
  name: string,
  lang: string[]
): { type: string; normalized: string; simplified: string };

export function compare(
  a: { name: string; lang?: string },
  b: { name: string; lang?: string },
  options?: { ignoreBrackets?: boolean}
): { score: number; reason?: string };

export function compareWithAlias(
  a: { name: string; lang?: string },
  b: { name: string; lang?: string },
  options?: { ignoreBrackets?: boolean}
): { score: number; reason?: string };
