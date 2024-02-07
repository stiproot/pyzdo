<template>
  <div
    v-if="!actioning"
    class="qa-pa-md row items-start q-gutter-md"
  >
    <ItemSelectorComponent
      :items="enrichedActions"
      @action-click="handleActionClick"
    />
  </div>

  <br />

  <q-btn-group push>
    <BtnComponent
      v-if="!actioning"
      class="float-right"
      icon="replay"
      @click="handleActionAllClick"
    />
  </q-btn-group>

  <ProcessesComponent v-if="actioning" :blueprints="processes" />

</template>
<script>
import { ref, computed, reactive, toRefs, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import { useLoadingStore, LoadingProvider } from "@/stores/loading.store.js";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";
import ItemSelectorComponent from "./ItemSelectorComponent.vue";
import BtnComponent from "./BtnComponent.vue";
import ProcessesComponent from "./ProcessesComponent.vue";
import { ext } from "@/services/azdo-proxy.service";
import {
  useStructuresStore,
  StructuresProvider,
} from "@/stores/structures.store.js";
import { generateGuid } from "@/services/guids.service";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { ACTIONS, WORK_ITEM_CHILD_RELATIONSHIPS } from "@/services/actions.service";
import { deepCopy } from "@/services/clone.service";

export default {
  name: "ActionsManagerComponent",
  components: {
    ItemSelectorComponent,
    BtnComponent,
    ProcessesComponent,
  },
  setup() {
    const nav = new NavigationService(useRouter());

    const processProvider = new ProcessProvider(useProcessStore());
    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const structProvider = new StructuresProvider(useStructuresStore());
    const { getSummarizedTree } = structProvider;

    const loadingProvider = new LoadingProvider(useLoadingStore());
    const { isLoading } = loadingProvider;

    const enrichedActionsArr = ACTIONS.map((a) => ({
      ...a,
      actions: [
        {
          evtId: "action-click",
          btnText: "run",
        }
      ],
    }));
    const enrichedActions = ref(enrichedActionsArr);

    const actioning = ref(false);
    const isNew = computed(() => nav.isNew);

    const data = reactive({
      isLoading,
      enrichedActions,
      actioning,
      isNew,
      processes,
    });

    const mapUpdatePercCmds = (items) => {

      const procs = items.map(n => ({
          id: generateGuid(),
          display: `Updating % Complete: ${n.title} (${n.type})`,
          project_id: "default",
          status: PROCESS_STATUSES.RUNNING,
          cmd_type: CMD_TYPES.UPDATE_UNIT_OF_WORK,
          unit_of_work_id: n.id,
          unit_of_work_perc_complete: n.perc_complete,
        }));

      const cmds = procs.map(p => ({
        idempotencyId: p.id,
        projectId: "default",
        cmdType: CMD_TYPES.UPDATE_UNIT_OF_WORK,
        cmdData: { 
          cmd: {
            id: p.unit_of_work_id, 
            complete: Math.ceil(p.unit_of_work_perc_complete), 
            history: `(Automated) updating percentage complete to ${p.unit_of_work_perc_complete}%`
          }
        }
      }));

      return { procs: procs, cmds: cmds };
    };

    const mapCloseCmds = (items) => {

      const procs = items.map(n => ({
          id: generateGuid(),
          display: `Closing children work items of type ${n.type}:`,
          project_id: "default",
          status: PROCESS_STATUSES.RUNNING,
          cmd_type: CMD_TYPES.UPDATE_UNIT_OF_WORK,
          unit_of_work_id: n.id,
          state: "Closed",
        }));

      const cmds = procs.map(p => ({
        idempotencyId: p.id,
        projectId: "default",
        cmdType: CMD_TYPES.UPDATE_UNIT_OF_WORK,
        cmdData: { 
          cmd: {
            id: p.unit_of_work_id, 
            state: p.state,
            // history: "(Automated) Closing work item, as all children are complete."
          }
        }
      }));

      return { procs: procs, cmds: cmds };
    }

    const handleUpdatePercAction = async (items) => {
      const { procs, cmds } = mapUpdatePercCmds(items);
      await executeProcs(procs, cmds);
    };

    const handleCloseStaleAction = async (items) => {
      console.log('handleCloseStaleAction', 'items', items);
      const { procs, cmds } = mapCloseCmds(items);
      await executeProcs(procs, cmds);
    }

    function filterUpdatePercNodes(node, output, wiTypes ){
      if(wiTypes.includes(node.type)) {
        output.push(node);
      }

      for(const child of node.children) {
        filterUpdatePercNodes(child, output, wiTypes);
      }
    }

    function filterCloseNodes(tree, toCloseArr, rootNodeType) {

      if (!tree.children || !tree.children.length) return;

      let allChildrenClosed = true;

      for (const child of tree.children) {
        filterCloseNodes(child, toCloseArr, rootNodeType);

        if (child.state !== "Closed") {
          allChildrenClosed = false;
          continue;
        }
      }

      if (allChildrenClosed && tree.state !== "Closed" && tree.type !== "Task") {

        // very inefficient, come back to this...
        if(WORK_ITEM_CHILD_RELATIONSHIPS[rootNodeType].includes(tree.type)){
          tree.state = "Closed";
          tree.auto_closed = true;
          toCloseArr.push(tree);
        }
      }
    }

    const handleActionClick = async (evt) => {

      console.log(evt.item);

      const nodes = [];

      if(evt.item.id.startsWith("UPDATE")) {
        filterUpdatePercNodes(getSummarizedTree.value, nodes, [evt.item.wi_type]);
        await handleUpdatePercAction(nodes);
        return;
      }

      if(evt.item.id.startsWith("CLOSE")) {
        filterCloseNodes(deepCopy(getSummarizedTree.value), nodes, evt.item.wi_type);
        await handleCloseStaleAction(nodes);
        return;
      }

      throw Error("Unsupported action...");
    };

    const handleActionAllClick = async () => {
      const root = deepCopy(getSummarizedTree.value);

      // update %
      const percNodes = [];
      const wiTypes = ["Programme", "Medium Project"];
      filterUpdatePercNodes(root, percNodes, wiTypes);
      const { procs: percProcs, cmds: percCmds } = mapUpdatePercCmds(percNodes);

      // close
      const closeNodes = [];
      closeNodes(root, closeNodes, "Epic");
      const { procs: closeProcs, cmds: closeCmds } = mapCloseCmds(closeNodes);

      const procs = [...percProcs, ...closeProcs];
      const cmds = [...percCmds, ...closeCmds];

      await executeProcs(procs, cmds);
    };

    const handleActioningProcessesComplete = () => {
      processes.value = [];
      actioning.value = false;
    };

    const executeProcs = async (procs, cmds) => {

      processes.value = procs;
      actioning.value = true;

      await syncAll();

      await Promise.all(cmds.map((cmd) => ext(cmd)));

      initProcessInterval();
    }

    const handleCloseClick = () => {
    };

    const initProcessInterval = () => {
      let intervalId = setInterval(async () => {
        if (isStillRunning.value) {
          await refresh();
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            handleActioningProcessesComplete();
          }, 4000);
        }
      }, 3000);
    };

    const initState = () => {
    };

    watch(() => getSummarizedTree.value, (v) => console.log(v));

    onMounted(async () => {
      await structProvider.init(nav.projId);
      initState();
    });

    return {
      ...toRefs(data),
      handleActionAllClick,
      handleActionClick,
      handleCloseClick,
    };
  },
};
</script>
<style></style>
