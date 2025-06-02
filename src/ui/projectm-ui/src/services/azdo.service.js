import { HttpClient } from "./http.client";

const _BASE_URL = "https://dev.azure.com/Xo/XoProj";
const BASE_URL = "https://dev.azure.com/Xo/_apis/wit";
const TEAMS_BASE_URL = "https://dev.azure.com/Xo/_apis/projects/XoProj";

const DEFAULT_API_VERSION = "api-version=7.1";
const API_KEY = () => process.env.VUE_APP_AZDO_API_KEY;

const httpClient = new HttpClient(BASE_URL);
const _httpClient = new HttpClient(_BASE_URL);
const teamsHttpClient = new HttpClient(TEAMS_BASE_URL);

const buildHeaders = () => {
  return {
    Authorization: `Basic ${API_KEY()}`,
  };
};

const QUERY_ROUTE = "queries";
const WIQL_ROUTE = "wiql";
const WI_ROUTE = "workitems";
const TEAMS_ROUTE = "teams";
const ITERATIONS_ROUTE = "iterations";
const TEAM_SETTINGS_ROUTE = "teamsettings";

// const FOLDER = () => process.env.VUE_APP_DEFAULT_QUERY_FOLDER;
// const buildQueryPath = (name) => `${FOLDER()}/${name}`;
// const buildQueryParams = () => "?$expand=wiql";

// const buildQueryUrl = (req) => {
//   const { id, name } = req;

//   if (name) {
//     return `/${QUERY_ROUTE}/${buildQueryPath(name)}${buildQueryParams()}`;
//   } else if (id) {
//     return `/${QUERY_ROUTE}/${id}${buildQueryParams()}`;
//   } else {
//     throw new Error("No query id or name provided");
//   }
// };

const buildWiqlUrl = () => `/${WIQL_ROUTE}?${DEFAULT_API_VERSION}`;
const buildFilterQueriesUrl = (filter) =>
  `/${QUERY_ROUTE}?$filter=${filter}&$expand=minimal&${DEFAULT_API_VERSION}`;

// https://dev.azure.com/Xo/_apis/wit/workitems/1066390?$expand=all&api-version=7.0
const buildGetWiDetailsUrl = (id) =>
  `/${WI_ROUTE}/${id}?$expand=all&${DEFAULT_API_VERSION}`;

// https://dev.azure.com/Xo/_apis/projects/XoProj/teams?api-version=7.1&$top=500
const buildGetAllTeamsUrl = () =>
  `/${TEAMS_ROUTE}?$top=500&${DEFAULT_API_VERSION}`;

// https://dev.azure.com/Xo/CEM - N2 Chapmans Peak Project Team/_apis/work/teamsettings/iterations/?api-version=7.0
const buildGetTeamIterationsUrl = (team) =>
  `/${team}/_apis/work/${TEAM_SETTINGS_ROUTE}/${ITERATIONS_ROUTE}/?${DEFAULT_API_VERSION}`;

// export async function getQuery(req) {
//   if (!req.id && !req.name) {
//     console.warn("No query id or name provided");
//     return null;
//   }
//   const headers = buildHeaders();
//   const url = buildQueryUrl(req);
//   // console.log(url);
//   try {
//     const response = await httpClient.get(url, headers);
//     return response;
//   } catch (error) {
//     // console.log(error);
//     return null;
//   }
// }

export async function runWiql(wiql) {
  const headers = buildHeaders();
  const url = buildWiqlUrl();
  try {
    const response = await httpClient.post(url, { query: wiql }, headers);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function filterQueries(filter) {
  if (filter === "") {
    console.warn("No query id or name provided");
    return [];
  }

  const headers = buildHeaders();
  const url = buildFilterQueriesUrl(filter);

  try {
    const response = await httpClient.get(url, headers);
    return response.value;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getWiDetails(id) {
  if (!id) {
    console.warn("No id provided");
    return null;
  }

  const headers = buildHeaders();
  const url = buildGetWiDetailsUrl(id);

  try {
    const resp = await httpClient.get(url, headers);
    return resp;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllTeams() {
  const headers = buildHeaders();
  const url = buildGetAllTeamsUrl();

  try {
    const resp = await teamsHttpClient.get(url, headers);
    return resp.value;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTeamIterations(team) {
  const headers = buildHeaders();
  const url = buildGetTeamIterationsUrl(team);

  try {
    const resp = await _httpClient.get(url, headers);
    return resp.value;
  } catch (error) {
    // console.log(error);
    return [];
  }
}
