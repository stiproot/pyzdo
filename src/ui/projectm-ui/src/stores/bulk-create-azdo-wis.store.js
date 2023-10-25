import { defineStore } from "pinia";
import { computed } from "vue";
import { ext } from "@/services/azdo-proxy.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { generateGuid } from "@/services/guids.service";

const defaultState = () => ({
  blueprints: null,
});

const ACTIONS = {
  INIT: "init",
  UPSERT: "upsert",
  SET_BLUEPRINTS: "setBlueprints",
};

const GETTERS = {
  IS_VALID_STATE: "isValidState",
  GET_STATE: "getState",
  GET_BLUEPRINTS: "getBlueprints",
};

const actions = {
  [ACTIONS.INIT](data) {
    const { blueprints } = data || defaultState();
    this.blueprints = blueprints;
  },
  async [ACTIONS.UPSERT](idempotencyId) {
    const payload = JSON.parse(this.blueprints);
    const cmd = {
      idempotencyId: idempotencyId || generateGuid(),
      projectId: "default",
      cmdType: CMD_TYPES.BULK_CREATE_UNITS_OF_WORK,
      cmdData: { cmds: payload },
    };

    await ext(cmd);
  },
  [ACTIONS.SET_BLUEPRINTS](blueprints) {
    this.blueprints = blueprints;
  },
};

const getters = {
  [GETTERS.IS_VALID_STATE]() {
    return this.blueprints && this.blueprints.length > 0;
  },
  [GETTERS.GET_STATE]() {
    return this.$state;
  },
  [GETTERS.GET_BLUEPRINTS]() {
    return this.blueprints;
  },
};

export const useBulkCreateAzdoWisStore = defineStore(
  "bulk-create-azdo-wis-store",
  {
    state: () => defaultState(),
    actions: { ...actions },
    getters: { ...getters },
  }
);

export class BulkCreateAzdoWisProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
    this.upsert = this.upsert.bind(this);
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

  get wis() {
    return computed({
      get: () => this._store[GETTERS.GET_BLUEPRINTS],
      set: (value) => {
        this._store[ACTIONS.SET_BLUEPRINTS](value);
      },
    });
  }
}
