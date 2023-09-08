const BASE_URL = 'http://0.0.0.0:8000/';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br'
};

/**
 * Perform an HTTP GET request.
 * @param {string} url - The API endpoint.
 * @param {object} headers - Custom headers (optional).
 * @returns {Promise} - A Promise that resolves with the response data or rejects with an error.
 */
async function get(url, headers = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
  });
  if (!response.ok) {
    throw new Error(`GET request to ${url} failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Perform an HTTP POST request.
 * @param {string} url - The API endpoint.
 * @param {object} data - The data to send in the request body.
 * @param {object} headers - Custom headers (optional).
 * @returns {Promise} - A Promise that resolves with the response data or rejects with an error.
 */
async function post(url, data, headers = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`POST request to ${url} failed with status ${response.status}`);
  }

  return response.json();
}

module.exports = { get, post };
