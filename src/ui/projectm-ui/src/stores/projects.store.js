import { computed } from "vue";
import { defineStore } from "pinia";
import { getProjects } from "@/services/projects.qry.service";

const defaultState = () => ({
  projects: [],
});

const ACTIONS = {
  INIT: "init",
};

const GETTERS = {
  GET_PROJECTS: "getProjects",
  GET_ENRICHED_PROJECTS: "getEnrichedProjects",
};

const actions = {
  async [ACTIONS.INIT]() {
    const data = await getProjects();
    this.projects = data;
  },
};

const getters = {
  [GETTERS.GET_PROJECTS]() {
    return this.projects;
  },
  [GETTERS.GET_ENRICHED_PROJECTS]() {
    return this.projects.map((project) => {
      return {
        ...project,
        title: project.name,
        actions: [
          { evtId: "view-click", btnText: "view" },
          { evtId: "visuals-click", btnText: "visuals" },
        ],
      };
    });
  },
};

export const useProjectsStore = defineStore("projects", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class ProjectsProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
  }

  async init() {
    await this._store[ACTIONS.INIT]();
  }

  get getProjects() {
    return computed(() => this._store[GETTERS.GET_PROJECTS]);
  }

  get enrichedProjects() {
    return computed(() => this._store[GETTERS.GET_ENRICHED_PROJECTS]);
  }
}
