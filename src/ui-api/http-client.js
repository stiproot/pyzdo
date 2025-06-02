const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Accept-Encoding": "gzip, deflate, br",
};

class HttpClient {
  constructor(baseUrl) {
    this.BASE_URL = baseUrl;
  }

  async get(path, headers = {}) {
    const url = `${this.BASE_URL}/${path}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error(
        `GET request to ${url} failed with status ${response.status}`
      );
    }
    return response.json();
  }

  async post(path, data, headers = {}) {
    const url = `${this.BASE_URL}/${path}`;
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
}

module.exports = HttpClient;
