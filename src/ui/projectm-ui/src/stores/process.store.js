import { computed } from "vue";
import { defineStore } from "pinia";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import { getProcesses } from "@/services/processes.qry.service";
import { upsertProcesses } from "@/services/processes.service";

const defaultState = () => ({
  processes: [],
});

const ACTIONS = {
  INIT: "init",
  SET_PROCESSES: "setProcesses",
  REFRESH: "refresh",
  SYNC_ALL: "syncAll",
  SYNC_RUNNING: "syncRunning",
  ADD_PROCESS: "addProcess",
};

const GETTERS = {
  GET_PROCESSES: "getProcesses",
  GET_PROCESS: "getProcess",
  IS_STILL_RUNNING: "isStillRunning",
  GET_RUNNING: "getRunning",
};

const actions = {
  [ACTIONS.INIT](procs) {
    const { processes } = procs || defaultState();
    this.processes = processes;
  },
  async [ACTIONS.SET_PROCESSES](data) {
    this.processes = data;
  },
  async [ACTIONS.REFRESH]() {
    const ids = this.processes.map((p) => p.id);
    const data = await getProcesses(ids);
    this.processes = data;
  },
  async [ACTIONS.ADD_PROCESS](process) {
    this.processes.push(process);
  },
  async [ACTIONS.SYNC_ALL]() {
    await upsertProcesses(this.processes);
  },
  async [ACTIONS.SYNC_RUNNING]() {
    const running = this[GETTERS.GET_RUNNING];
    await upsertProcesses(running);
  },
};

const getters = {
  [GETTERS.GET_PROCESSES]() {
    return this.processes;
  },
  [GETTERS.GET_PROCESS](id) {
    return this.processes.find((p) => p.id === id);
  },
  [GETTERS.IS_STILL_RUNNING]() {
    const running = this.processes.some(
      (p) => p.status === PROCESS_STATUSES.RUNNING
    );
    return running;
  },
  [GETTERS.GET_RUNNING]() {
    return this.processes.filter((p) => p.status === PROCESS_STATUSES.RUNNING);
  },
};

export const useProcessStore = defineStore("processes", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class ProcessProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
    this.sync = this.sync.bind(this);
    this.syncAll = this.syncAll.bind(this);
    this.syncRunning = this.syncRunning.bind(this);
    this.addProcess = this.addProcess.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async init(procs) {
    await this._store[ACTIONS.INIT](procs);
  }

  async refresh() {
    await this._store[ACTIONS.REFRESH]();
  }

  async addProcess(process) {
    await this._store[ACTIONS.ADD_PROCESS](process);
  }

  async syncAll() {
    await this._store[ACTIONS.SYNC_ALL]();
  }

  async syncRunning() {
    await this._store[ACTIONS.SYNC_RUNNING]();
  }

  async sync() {
    await this._store[ACTIONS.SYNC]();
  }

  get processes() {
    return computed({
      get: () => this._store[GETTERS.GET_PROCESSES],
      set: (value) => {
        this._store[ACTIONS.SET_PROCESSES](value);
      },
    });
  }

  get isStillRunning() {
    return computed(() => this._store[GETTERS.IS_STILL_RUNNING]);
  }

  getProcess(id) {
    return computed(() => this._store[GETTERS.GET_PROCESS](id));
  }
}
