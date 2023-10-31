import { computed } from "vue";
import { defineStore } from "pinia";
import {
  getWeightedTree,
  getSummarizedTree,
} from "@/services/structures.qry.service";

const defaultState = () => ({
  summarizedTree: null,
  weightedTree: null,
});

const ACTIONS = {
  INIT: "init",
};

const GETTERS = {
  GET_SUMMARIZED_TREE: "getSummarizedTree",
  GET_WEIGHTED_TREE: "getWeightedTree",
  IS_INITIALIZED: "isInitialized",
  GET_STRUCTURES: "getStructures",
  GET_ENRICHED_STRUCTURES: "getEnrichedStructures",
};

const actions = {
  async [ACTIONS.INIT](id) {
    const [resp1, resp2] = await Promise.all([
      getSummarizedTree(id),
      getWeightedTree(id),
    ]);

    this.summarizedTree = resp1;
    this.weightedTree = resp2;
  },
  [ACTIONS.SET_INITIALIZED](bit) {
    this.isInitialized = bit;
  },
};

const getters = {
  [GETTERS.IS_INITIALIZED]() {
    return this.summarizedTree !== null && this.weightedTree !== null;
  },
  [GETTERS.GET_SUMMARIZED_TREE]() {
    return this.summarizedTree;
  },
  [GETTERS.GET_WEIGHTED_TREE]() {
    return this.weightedTree;
  },
  [GETTERS.GET_STRUCTURES]() {
    return [
      { id: "summarized_tree", structure: this.summarizedTree },
      { id: "weighted_tree", structure: this.weightedTree },
    ];
  },
  [GETTERS.GET_ENRICHED_STRUCTURES]() {
    return this[GETTERS.GET_STRUCTURES].map((i) => ({
      ...i,
      title: i.name || i.id,
      actions: [
        {
          evtId: "item-click",
          btnText: "view",
        },
      ],
    }));
  },
};

export const useStructuresStore = defineStore("structures", {
  state: () => defaultState(),
  actions: { ...actions },
  getters: { ...getters },
});

export class StructuresProvider {
  constructor(store) {
    this._store = store;
    this.init = this.init.bind(this);
    this.initThen = this.initThen.bind(this);
  }

  async init(id) {
    await this._store[ACTIONS.INIT](id);
  }

  initThen(id, callback) {
    if (this.isInitialized.value) {
      callback();
      return;
    }
    Promise.all([this.init(id)]).then(callback);
  }

  get structures() {
    return computed(() => this._store[GETTERS.GET_STRUCTURES]);
  }

  get enrichedStructures() {
    return computed(() => this._store[GETTERS.GET_ENRICHED_STRUCTURES]);
  }

  get isInitialized() {
    return computed(() => this._store[GETTERS.IS_INITIALIZED]);
  }

  get getSummarizedTree() {
    return computed(() => this._store[GETTERS.GET_SUMMARIZED_TREE]);
  }

  get getWeightedTree() {
    return computed(() => this._store[GETTERS.GET_WEIGHTED_TREE]);
  }
}
