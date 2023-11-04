import { defineStore } from "pinia";
import { computed } from "vue";

const defaultState = () => ({
  maximized: false,
});

const ACTIONS = {
  SET_MAXIMIZED: "setMaximized",
};

const GETTERS = {
  GET_MAXIMIZED: "getMaximized",
};

const actions = {
  [ACTIONS.SET_MAXIMIZED](data) {
    this.maximized = data;
  },
};

const getters = {
  [GETTERS.GET_MAXIMIZED]() {
    return this.$state.maximized;
  },
};

export const useLayoutStore = defineStore("layout", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class LayoutProvider {
  constructor(store) {
    this._store = store;
  }

  get maximized() {
    return computed({
      get: () => this._store[GETTERS.GET_MAXIMIZED],
      set: (value) => {
        this._store[ACTIONS.SET_MAXIMIZED](value);
      },
    });
  }

  get minimized() {
    return computed({
      get: () => !this._store[GETTERS.GET_MAXIMIZED],
      set: (value) => {
        this._store[ACTIONS.SET_MAXIMIZED](!value);
      },
    });
  }
}
