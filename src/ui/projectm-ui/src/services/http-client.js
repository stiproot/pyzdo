const BASE_URL = () => process.env.VUE_APP_UI_API_BASE_URL;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * Perform an HTTP POST request.
 * @param {string} url - The API endpoint.
 * @param {object} data - The data to send in the request body.
 * @param {object} headers - Custom headers (optional).
 * @returns {Promise} - A Promise that resolves with the response data or rejects with an error.
 */
async function post(route, data, headers = {}) {
  console.log(
    "process.env.VUE_APP_UI_API_BASE_URL",
    process.env.VUE_APP_UI_API_BASE_URL
  );
  const url = `${BASE_URL()}${route}`;
  console.log("http-client", "url", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(
      `POST request to ${url} failed with status ${response.status}`
    );
  }
  return response.json();
}

export { post };
