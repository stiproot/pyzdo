import { defineStore } from "pinia";
import { computed } from "vue";

const defaultState = () => ({
  name: null,
  ql: null,
});

const ACTIONS = {
  INIT: "init",
  SET_NAME: "setName",
  SET_QL: "setQl",
};

const GETTERS = {
  GET_NAME: "getName",
  GET_QL: "getQl",
  IS_STATE_VALID: "isStateValid",
  GET_STATE: "getState",
};

const actions = {
  [ACTIONS.INIT](data) {
    const { name, ql } = data || defaultState();
    this.name = name;
    this.ql = ql;
  },
  [ACTIONS.SET_NAME](data) {
    this.name = data;
  },
  [ACTIONS.SET_QL](data) {
    this.ql = data;
  },
};

const getters = {
  [GETTERS.GET_NAME]() {
    return this.name;
  },
  [GETTERS.GET_QL]() {
    return this.ql;
  },
  [GETTERS.IS_STATE_VALID]() {
    return this.name && this.ql;
  },
  [GETTERS.GET_STATE]() {
    return this.$state;
  },
};

export const useQueryStore = defineStore("query", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class QueryProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
  }

  init(data) {
    this._store[ACTIONS.INIT](data);
  }

  get name() {
    return computed({
      get: () => this._store[GETTERS.GET_NAME],
      set: (value) => {
        this._store[ACTIONS.SET_NAME](value);
      },
    });
  }

  get ql() {
    return computed({
      get: () => this._store[GETTERS.GET_QL],
      set: (value) => {
        this._store[ACTIONS.SET_QL](value);
      },
    });
  }

  get isStateValid() {
    return computed(() => this._store[GETTERS.IS_STATE_VALID]);
  }

  get state() {
    return computed(() => this._store[GETTERS.GET_STATE]);
  }
}
