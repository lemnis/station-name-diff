import fetch from "node-fetch";

const sparqlEndpoint = "https://query.wikidata.org/sparql";
const wikidataEndpoint = "https://www.wikidata.org/w/api.php";

/**
 * @param {string} name
 * @returns {Promise<{ name: string, lang: string }[]>}
 */
export const getAlias = async (name) => {
  const qidResponse = await fetch(
    wikidataEndpoint +
      `?action=wbsearchentities&search=${name}&format=json&errorformat=plaintext&language=en&uselang=en&type=item&limit=1`
  );
  /** @type {any} */
  const qidJson = await qidResponse.json();
  /** @type {string} */
  const qid = qidJson.search[0].id;

  const sparqlQuery = `SELECT DISTINCT ?label ?lang WHERE {
    VALUES ?item {
      wd:${qid}
    }
    
    { SELECT DISTINCT ?item (STR(?l) as ?label) (LANG(?l) as ?lang) WHERE { ?item rdfs:label ?l. } }
    UNION
    { SELECT DISTINCT ?item (STR(?l) as ?label) (LANG(?l) as ?lang) WHERE { ?item skos:altLabel ?l. }}
  }
  GROUP BY ?item ?label ?lang
  ORDER BY ?label
  `;
  const sparql = await fetch(
    sparqlEndpoint + "?query=" + encodeURIComponent(sparqlQuery),
    {
      headers: { Accept: "application/sparql-results+json" },
    }
  );
  /** @type {any} */
  const sparqlJson = await sparql.json();

  return sparqlJson.results.bindings.map((item) => ({
    name: item.label.value,
    lang: item.lang.value,
  }));
};
