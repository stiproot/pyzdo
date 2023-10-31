export class PollingService {
  constructor(service, pollInterval) {
    this._service = service;
    this._pollInterval = pollInterval;
  }

  async pollForCondition(condition) {
    return new Promise((resolve) => {
      const checkCondition = async () => {
        try {
          const resp = await this._service();

          if (condition(resp)) {
            resolve(resp);
          } else {
            setTimeout(checkCondition, this._pollInterval);
          }
        } catch (error) {
          setTimeout(checkCondition, this._pollInterval);
        }
      };

      checkCondition();
    });
  }
}
