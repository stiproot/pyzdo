import { computed } from "vue";
import { defineStore } from "pinia";

const defaultState = () => ({
  staged: {},
});

const ACTIONS = {
  INIT: "init",
};

const GETTERS = {
  GET_STAGED: "getStaged",
};

const actions = {
  [ACTIONS.INIT](data) {
    this.staged = data;
  },
};

const getters = {
  [GETTERS.GET_STAGED]() {
    return this.staged;
  },
};

export const useStructureStagingStore = defineStore("structure-staging", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class StructureStagingProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
  }

  init(data) {
    this._store[ACTIONS.INIT](data);
  }

  get staged() {
    return computed(() => this._store[GETTERS.GET_STAGED]);
  }
}
