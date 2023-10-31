import { defineStore } from "pinia";
import { computed } from "vue";
import { getTeamIterations } from "@/services/azdo.service";

const defaultState = () => ({
  iterations: [],
  team: null,
});

const ACTIONS = {
  INIT: "init",
  SET_TEAM: "setTeam",
  SET_ITERATIONS: "setIterations",
};

const GETTERS = {
  GET_TEAM: "getTeam",
  GET_ITERATIONS: "getIterations",
};

const actions = {
  async [ACTIONS.INIT](team) {
    if (this.team === team) {
      return;
    }

    this.team = team;

    const data = await getTeamIterations(this.team);
    this.iterations = data;
  },
  [ACTIONS.SET_TEAM](team) {
    this.team = team;
  },
  [ACTIONS.SET_ITERATIONS](iterations) {
    this.iterations = iterations;
  },
};

const getters = {
  [GETTERS.GET_TEAM]() {
    return this.team;
  },
  [GETTERS.GET_ITERATIONS]() {
    return this.iterations;
  },
};

export const useIterationsStore = defineStore("iterations-store", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class IterationsProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
    this.filter = this.filter.bind(this);
  }

  async init(team) {
    await this._store[ACTIONS.INIT](team);
  }

  filter(filter) {
    const lowerFilter = filter.toLowerCase();
    return this.iterations.value.filter((i) =>
      i.name.toLowerCase().includes(lowerFilter)
    );
  }

  get team() {
    return computed({
      get: () => this._store[GETTERS.GET_TEAM],
      set: (value) => {
        this._store[ACTIONS.SET_TEAM](value);
      },
    });
  }

  get iterations() {
    return computed({
      get: () => this._store[GETTERS.GET_ITERATIONS],
      set: (value) => {
        this._store[ACTIONS.SET_ITERATIONS](value);
      },
    });
  }
}
