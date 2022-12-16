# station-normalize

As correctly said in [this article](https://bflorat.medium.com/proper-strings-normalization-for-comparison-purpose-226773865322)

> Don’t even compare human text if you can

As such, you shouldn't rely on this package as only data point.

## But than why this package?

Stations can sometimes can be located very close to each other with a similar name,but on a similar note a location can be known under multiple names.

As we should be able have a educated guess if 2 locations are the same, as such we should detect that

[Einhoven Centraal](https://goo.gl/maps/x3LaVxQ2DqoKR1t58) and [Eindhoven Strijp-S](https://goo.gl/maps/VsvqgiNQDfYzidac8) are not the same, but that [Einhoven Centraal](https://goo.gl/maps/x3LaVxQ2DqoKR1t58) and [Einhoven](https://goo.gl/maps/mVpv7ZimaXqkczsq6) are the same.

## Features

- Digest station name:
  - To city, country, etc...
  - Logic to split multilanguage label
  - Harmonize (clean-up duplicate spaces, replace `—` with `-`, etc.)
  - Proposal: `parse(name: string, coordinates: { lat: number, lon: number }, language?: string[]) => { country?: string, appendix?: string, type?: string, harmonized: string }`
- Slugify in different formats
- Name comparison
  - Proposal: `compare({ name: string, coordinates: { lat: number, lon: number }, language?: string[] }, { name: string, coordinates: { lat: number, lon: number }, language?: string[] }) => { score: number, harmonizedEqual: boolean, digest: [any, any]}`

## Type

[Central Station](https://en.wikipedia.org/wiki/Central_station#Netherlands)
[Halt](https://en.wikipedia.org/wiki/Train_station#Halt)

## Comparisons

Use `compare({ name: ... }, { name: ... })`

- City name should match city name when appended with central station, `Eindhoven` == `Eindhoven Centraal`
- Should recoginize abbrevations, `St. Pölten` == `Sankt Pölten`
- Should recognize diacritics, `Woergl` == `Wörgl` and `Worgl` == `Wörgl`
- Ignore dash (when possible?),`'s-Hertogenbosch` == `'s Hertogenbosch`
- Compare different seperators, `Bascharage-Sanem` == `Bascharage/Sanem`
- Ignores country names, `Athens (Greece)` == `Athens`

### Comparing with aliases

Use `compareWithAlias({ name: ... }, { name: ... })`

To compare a aliases wikidata's database is used, rate limits may apply.

- This is useful for comparing [exonyms](https://en.wikipedia.org/wiki/Endonym_and_exonym),`Köln` != `Cologne`
- Or for aliases,`Den Bosch` != `'s-Hertogenbosch`


## Comparisons that should fail

- Substation should not at match city name, `Eindhoven` != `Eindhoven Strijp-S`
