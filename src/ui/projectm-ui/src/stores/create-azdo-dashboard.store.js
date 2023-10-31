import { defineStore } from "pinia";
import { computed } from "vue";
import { ext } from "@/services/azdo-proxy.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { generateGuid } from "@/services/guids.service";

const defaultState = () => ({
  dashboardName: "",
  iterationPath: "",
  teamName: "",
  queryFolderBasePath:
    "Shared Queries/Customers and Emerging Markets/Rapid Response/N2 Chapmans Peak Project Team/Project Metrics/Dashboard Queries",
  initiatives: [],
});

const ACTIONS = {
  INIT: "init",
  SET_NAME: "setName",
  SET_ITERATION_PATH: "setIterationPath",
  SET_TEAM_NAME: "setTeamName",
  SET_QUERY_FOLDER_BASE_PATH: "setQueryFolderBasePath",
  SET_INITIATIVES: "setInitiatives",
  ADD_INITIATIVE: "addInitiative",
  REMOVE_INITIATIVE: "removeInitiative",
  UPSERT: "upsert",
};

const GETTERS = {
  GET_NAME: "getName",
  GET_ITERATION_PATH: "getIterationPath",
  GET_TEAM_NAME: "getTeamName",
  GET_QUERY_FOLDER_BASE_PATH: "getQueryFolderBasePath",
  GET_INITIATIVES: "getInitiatives",
  IS_VALID_STATE: "isValidState",
  GET_STATE: "getState",
};

const actions = {
  [ACTIONS.INIT](data) {
    const {
      dashboardName,
      iterationPath,
      teamName,
      queryFolderBasePath,
      initiatives,
    } = data || defaultState();

    this.dashboardName = dashboardName;
    this.iterationPath = iterationPath;
    this.teamName = teamName;
    this.queryFolderBasePath = queryFolderBasePath;
    this.initiatives = initiatives;
  },
  [ACTIONS.SET_NAME](data) {
    this.dashboardName = data;
  },
  [ACTIONS.SET_ITERATION_NAME](data) {
    this.iterationName = data;
  },
  [ACTIONS.SET_ITERATION_PATH](data) {
    this.iterationPath = data;
  },
  [ACTIONS.SET_TEAM_NAME](data) {
    this.teamName = data;
  },
  [ACTIONS.SET_QUERY_FOLDER_BASE_PATH](data) {
    this.queryFolderBasePath = data;
  },
  [ACTIONS.SET_INITIATIVES](data) {
    this.initiatives = data;
  },
  [ACTIONS.ADD_INITIATIVE](data) {
    this.initiatives.push(data);
  },
  [ACTIONS.REMOVE_INITIATIVE](data) {
    this.initiatives = this.initiatives.filter((x) => x.id !== data.id);
  },
  async [ACTIONS.UPSERT](idempotencyId) {
    const cmd = {
      idempotencyId: idempotencyId || generateGuid(),
      projectId: "default",
      cmdType: CMD_TYPES.CREATE_DASHBOARD,
      cmdData: { cmd: this.$state },
    };

    await ext(cmd);
  },
};

const getters = {
  [GETTERS.GET_NAME]() {
    return this.dashboardName;
  },
  [GETTERS.GET_ITERATION_PATH]() {
    return this.iterationPath;
  },
  [GETTERS.GET_TEAM_NAME]() {
    return this.teamName;
  },
  [GETTERS.GET_QUERY_FOLDER_BASE_PATH]() {
    return this.queryFolderBasePath;
  },
  [GETTERS.GET_INITIATIVES]() {
    return this.initiatives;
  },
  [GETTERS.IS_VALID_STATE]() {
    return (
      this.dashboardName &&
      this.iterationPath &&
      this.teamName &&
      this.queryFolderBasePath &&
      this.initiatives.length > 0
    );
  },
  [GETTERS.GET_STATE]() {
    return this.$state;
  },
};

export const useCreateAzdoDashboardStore = defineStore("azdo-dashboard", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class CreateAzdoDashboardProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
    this.upsert = this.upsert.bind(this);
    this.addInitiative = this.addInitiative.bind(this);
    this.removeInitiative = this.removeInitiative.bind(this);
  }

  addInitiative(data) {
    this._store[ACTIONS.ADD_INITIATIVE](data);
  }

  removeInitiative(data) {
    this._store[ACTIONS.REMOVE_INITIATIVE](data);
  }

  async init(data) {
    await this._store[ACTIONS.INIT](data);
  }

  async upsert(idempotencyId) {
    await this._store[ACTIONS.UPSERT](idempotencyId);
  }

  get isValidState() {
    return computed(() => this._store[GETTERS.IS_VALID_STATE]);
  }

  get state() {
    return computed(() => this._store[GETTERS.GET_STATE]);
  }

  get dashboardName() {
    return computed({
      get: () => this._store[GETTERS.GET_NAME],
      set: (value) => {
        this._store[ACTIONS.SET_NAME](value);
      },
    });
  }

  get iterationPath() {
    return computed({
      get: () => this._store[GETTERS.GET_ITERATION_PATH],
      set: (value) => {
        this._store[ACTIONS.SET_ITERATION_PATH](value);
      },
    });
  }

  get teamName() {
    return computed({
      get: () => this._store[GETTERS.GET_TEAM_NAME],
      set: (value) => {
        this._store[ACTIONS.SET_TEAM_NAME](value);
      },
    });
  }

  get queryFolderBasePath() {
    return computed({
      get: () => this._store[GETTERS.GET_QUERY_FOLDER_BASE_PATH],
      set: (value) => {
        this._store[ACTIONS.SET_QUERY_FOLDER_BASE_PATH](value);
      },
    });
  }

  get initiatives() {
    return computed({
      get: () => this._store[GETTERS.GET_INITIATIVES],
      set: (value) => {
        this._store[ACTIONS.SET_INITIATIVES](value);
      },
    });
  }
}
