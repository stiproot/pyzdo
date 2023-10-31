import { defineStore } from "pinia";
import { computed } from "vue";
import { getAllTeams } from "@/services/azdo.service";

const defaultState = () => ({
  teams: [],
});

const ACTIONS = {
  INIT: "init",
};

const GETTERS = {
  GET_TEAMS: "getTeams",
};

const actions = {
  async [ACTIONS.INIT]() {
    if (this.teams.length > 0) {
      return;
    }

    const data = await getAllTeams();
    this.teams = data;
  },
};

const getters = {
  [GETTERS.GET_TEAMS]() {
    return this.teams;
  },
};

export const useTeamsStore = defineStore("teams-store", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class TeamsProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
    this.filter = this.filter.bind(this);
  }

  async init() {
    await this._store[ACTIONS.INIT]();
  }

  filter(filter) {
    return this.teams.value.filter((team) => team.name.includes(filter));
  }

  get teams() {
    return computed(() => this._store[GETTERS.GET_TEAMS]);
  }
}
