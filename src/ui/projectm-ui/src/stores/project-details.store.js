import { defineStore } from "pinia";
import { computed } from "vue";
import { getProject } from "@/services/projects.qry.service";
import { upsertProject } from "@/services/projects.service";
import { generateGuid } from "@/services/guids.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import { gather } from "@/services/gather.service";

const defaultState = () => ({
  id: null,
  name: null,
  description: null,
  owner: null,
  created: null,
  queries: [],
  color: null,
});

const ACTIONS = {
  INIT: "init",
  SET_STATE: "setState",
  SET_ID: "setId",
  SET_NAME: "setName",
  SET_DESCRIPTION: "setDescription",
  SET_OWNER: "setOwner",
  SET_CREATED: "setCreated",
  SET_QUERIES: "setQueries",
  SET_COLOR: "setColor",
  ADD_QUERY: "addQuery",
  REMOVE_QUERY: "removeQuery",
  SYNC: "sync",
  RUN_QUERIES: "runQueries",
  MAP_QUERIES_TO_PROCESSES: "mapQueriesToProcesses",
};

const GETTERS = {
  IS_STATE_VALID: "isStateValid",
  GET_STATE: "getState",
  GET_ID: "getId",
  GET_NAME: "getName",
  GET_DESCRIPTION: "getDescription",
  GET_OWNER: "getOwner",
  GET_CREATED: "getCreated",
  GET_QUERIES: "getQueries",
  GET_COLOR: "getColor",
  GET_ENRICHED_QUERIES: "getEnrichedQueries",
  GET_QUERY: "getQuery",
};

const actions = {
  async [ACTIONS.INIT](projectId) {
    if (!projectId) {
      this[ACTIONS.SET_STATE](null);
      return;
    }
    const project = await getProject(projectId);
    this[ACTIONS.SET_STATE](project);
  },
  async [ACTIONS.SYNC]() {
    if (!this[GETTERS.IS_STATE_VALID]) {
      console.error("Project state is not valid, cannot sync");
      return;
    }
    await upsertProject(this.$state);
  },
  [ACTIONS.SET_STATE](data) {
    const { id, name, description, owner, created, queries, color } =
      data || defaultState();
    this.id = id;
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.created = created;
    this.queries = queries;
    this.color = color;
  },
  [ACTIONS.SET_ID](id) {
    this.id = id;
  },
  [ACTIONS.SET_NAME](name) {
    this.name = name;
  },
  [ACTIONS.SET_DESCRIPTION](description) {
    this.description = description;
  },
  [ACTIONS.SET_OWNER](owner) {
    this.owner = owner;
  },
  [ACTIONS.SET_CREATED](created) {
    this.created = created;
  },
  [ACTIONS.SET_QUERIES](queries) {
    this.queries = queries;
  },
  [ACTIONS.SET_COLOR](data) {
    this.color = data;
  },
  [ACTIONS.ADD_QUERY](data) {
    this.queries.push(data);
  },
  [ACTIONS.REMOVE_QUERY](name) {
    this.queries = this.queries.filter((query) => query.name !== name);
  },
  async [ACTIONS.RUN_QUERIES](procs) {
    // console.log("runQueries", procs);
    try {
      await Promise.all(
        procs.map((proc) => {
          gather({
            processId: proc.id,
            projectId: proc.project_id,
            ql: proc.ql,
          });
        })
      );
    } catch (e) {
      console.error(e);
    }
  },
  [ACTIONS.MAP_QUERIES_TO_PROCESSES](projectId) {
    const procs = this.queries.map((i) => ({
      id: generateGuid(),
      display: i.name,
      project_id: projectId,
      status: PROCESS_STATUSES.RUNNING,
      cmd_type: CMD_TYPES.GATHER_PROJECT_UNITS_OF_WORK,
      ql: i.ql,
    }));

    return procs;
  },
};

const validateState = (state) => {
  return (
    state.id &&
    state.name &&
    state.description &&
    state.owner &&
    state.color &&
    state.queries &&
    state.queries.length > 0
  );
};

const getters = {
  [GETTERS.IS_STATE_VALID]() {
    return validateState(this.$state);
  },
  [GETTERS.GET_STATE]() {
    return this.$state;
  },
  [GETTERS.GET_ID]() {
    return this.id;
  },
  [GETTERS.GET_NAME]() {
    return this.name;
  },
  [GETTERS.GET_DESCRIPTION]() {
    return this.description;
  },
  [GETTERS.GET_OWNER]() {
    return this.owner;
  },
  [GETTERS.GET_CREATED]() {
    return this.created;
  },
  [GETTERS.GET_QUERIES]() {
    return this.queries;
  },
  [GETTERS.GET_COLOR]() {
    return this.color;
  },
  [GETTERS.GET_ENRICHED_QUERIES]() {
    return this.queries.map((query) => ({
      ...query,
      description: query.name,
      actions: [
        {
          evtId: "item-click",
          btnText: "view",
        },
        {
          evtId: "delete-click",
          btnText: "delete",
        },
      ],
    }));
  },
  [GETTERS.GET_QUERY](name) {
    return this.queries.find((query) => query.name === name);
  },
};

export const useProjectDetailsStore = defineStore("project-details", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class ProjectDetailsProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
    this.sync = this.sync.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.addQuery = this.addQuery.bind(this);
    this.removeQuery = this.removeQuery.bind(this);
    this.runQueries = this.runQueries.bind(this);
    this.mapQueriesToProcesses = this.mapQueriesToProcesses.bind(this);
  }

  async init(projectId) {
    await this._store[ACTIONS.INIT](projectId);
  }

  async sync() {
    await this._store[ACTIONS.SYNC]();
  }

  getQuery(name) {
    return computed(() => this._store[GETTERS.GET_QUERY](name));
  }

  mapQueriesToProcesses(projectId) {
    return this._store[ACTIONS.MAP_QUERIES_TO_PROCESSES](projectId);
  }

  async runQueries(data) {
    await this._store[ACTIONS.RUN_QUERIES](data);
  }

  addQuery(data) {
    this._store[ACTIONS.ADD_QUERY](data);
  }

  removeQuery(name) {
    this._store[ACTIONS.REMOVE_QUERY](name);
  }

  get isStateValid() {
    return computed(() => this._store[GETTERS.IS_STATE_VALID]);
  }

  get enrichedQueries() {
    return computed(() => this._store[GETTERS.GET_ENRICHED_QUERIES]);
  }

  get state() {
    return computed({
      get: () => this._store[GETTERS.GET_STATE],
      set: (value) => {
        this._store[ACTIONS.SET_STATE](value);
      },
    });
  }

  get id() {
    return computed({
      get: () => this._store[GETTERS.GET_ID],
      set: (value) => {
        this._store[ACTIONS.SET_ID](value);
      },
    });
  }

  get name() {
    return computed({
      get: () => this._store[GETTERS.GET_NAME],
      set: (value) => {
        this._store[ACTIONS.SET_NAME](value);
      },
    });
  }

  get description() {
    return computed({
      get: () => this._store[GETTERS.GET_DESCRIPTION],
      set: (value) => {
        this._store[ACTIONS.SET_DESCRIPTION](value);
      },
    });
  }

  get owner() {
    return computed({
      get: () => this._store[GETTERS.GET_OWNER],
      set: (value) => {
        this._store[ACTIONS.SET_OWNER](value);
      },
    });
  }

  get created() {
    return computed({
      get: () => this._store[GETTERS.GET_CREATED],
      set: (value) => {
        this._store[ACTIONS.SET_CREATED](value);
      },
    });
  }

  get queries() {
    return computed({
      get: () => this._store[GETTERS.GET_QUERIES],
      set: (value) => {
        this._store[ACTIONS.SET_QUERIES](value);
      },
    });
  }

  get color() {
    return computed({
      get: () => this._store[GETTERS.GET_COLOR],
      set: (value) => {
        this._store[ACTIONS.SET_COLOR](value);
      },
    });
  }
}
