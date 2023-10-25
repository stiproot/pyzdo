import { defineStore } from "pinia";
import { computed } from "vue";

const defaultState = () => ({
  loading: false,
});

const ACTIONS = {
  SHOW_LOADING: "showLoading",
  HIDE_LOADING: "hideLoading",
  SET_LOADING: "setLoading",
};

const GETTERS = {
  IS_LOADING: "isLoading",
};

const actions = {
  [ACTIONS.SHOW_LOADING]() {
    this.loading = true;
  },
  [ACTIONS.HIDE_LOADING]() {
    this.loading = false;
  },
  [ACTIONS.SET_LOADING](bit) {
    this.loading = bit;
  },
};

const getters = {
  [GETTERS.IS_LOADING]() {
    return this.$state.loading;
  },
};

export const useLoadingStore = defineStore("loading", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class LoadingProvider {
  constructor(store) {
    this._store = store;
  }

  get isLoading() {
    return computed({
      get: () => this._store[GETTERS.IS_LOADING],
      set: (value) => {
        this._store[ACTIONS.SET_LOADING](value);
      },
    });
  }
}
