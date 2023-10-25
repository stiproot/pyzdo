import { HttpClient } from "./http.client";

const BASE_URL = "https://dev.azure.com/Derivco/Software/_apis/wit";
const QUERY_ROUTE = "queries/";
const WIQL_ROUTE = "wiql";
const DEFAULT_API_VERSION = "api-version=7.1";

const FOLDER = () => process.env.VUE_APP_DEFAULT_QUERY_FOLDER;
const API_KEY = () => process.env.VUE_APP_AZDO_API_KEY;

const httpClient = new HttpClient(BASE_URL);

const buildQueryPath = (name) => `${FOLDER()}/${name}`;
const buildQueryParams = () => "?$expand=wiql";
const buildHeaders = () => {
  return {
    Authorization: `Basic ${API_KEY()}`,
  };
};
const buildQueryUrl = (req) => {
  const { id, name } = req;

  if (name) {
    return `/${QUERY_ROUTE}/${buildQueryPath(name)}${buildQueryParams()}`;
  } else if (id) {
    return `/${QUERY_ROUTE}/${id}${buildQueryParams()}`;
  } else {
    throw new Error("No query id or name provided");
  }
};

const buildWiqlUrl = () => `/${WIQL_ROUTE}?${DEFAULT_API_VERSION}`;

export async function getQuery(req) {
  if (!req.id && !req.name) {
    console.warn("No query id or name provided");
    return null;
  }
  const headers = buildHeaders();
  const url = buildQueryUrl(req);
  console.log(url);
  try {
    const response = await httpClient.get(url, headers);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function runWiql(wiql) {
  const headers = buildHeaders();
  const url = buildWiqlUrl();
  console.log(url);
  try {
    const response = await httpClient.post(url, { query: wiql }, headers);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}
