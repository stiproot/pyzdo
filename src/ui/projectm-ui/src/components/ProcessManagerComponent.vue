<template>
  <div class="text-h4 q-mb-md">{{ title }}</div>
  <div class="q-pa-md">
    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        :active="active"
        v-for="i in processes"
        :key="i.id"
        :item="i"
        @item-click="onProcessClick"
      >
        <q-item-section>
          <q-item-label>{{ i.id }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ i.status }}</q-item-label>
        </q-item-section>
        <q-item-section avatar side v-if="i.status !== statuses.RUNNING">
          <q-icon
            color="yellow"
            v-if="i.status === statuses.RUNNING"
            name="run_circle"
          />
          <q-icon
            color="green"
            v-if="i.status === statuses.COMPLETE"
            name="check_small"
          />
          <q-icon
            color="red"
            v-if="i.status === statuses.ERROR"
            name="warning"
          />
        </q-item-section>
        <q-item-section side v-if="i.status === statuses.RUNNING">
          <q-circular-progress
            indeterminate
            size="30px"
            :thickness="0.3"
            color="lime"
            center-color="grey-8"
            class="q-mt-sm"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { onMounted, watch, reactive, toRefs, ref } from "vue";
import { gather } from "@/services/gather.service";
import { ext } from "@/services/azdo-proxy.service";
import { structure } from "@/services/structures.service";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
export default {
  name: "ProcessManagerComponent",
  props: {
    blueprints: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "Processes",
    },
  },
  setup(props, { emit }) {
    const processStore = useProcessStore();
    const processProvider = new ProcessProvider(processStore);

    const { init, processes, refresh, syncAll, isStillRunning } =
      processProvider;
    const statuses = ref(PROCESS_STATUSES);

    const data = reactive({
      processes,
      isStillRunning,
    });

    const tab = ref("processes");
    const executing = ref(false);
    let intervalId;

    function uninitInterval() {
      clearInterval(intervalId);
      intervalId = undefined;
    }

    function emitEvent() {
      emit("processes-complete", {});
    }

    function initInterval() {
      return setInterval(async () => {
        // // console.log("initInterval: isStillRunning?", data.isStillRunning);
        if (data.isStillRunning) {
          // // console.log("still running");
          await refresh();
        } else {
          // // console.log("not still running");
          executing.value = false;
          emitEvent();
        }
      }, 3000);
    }

    watch(
      () => executing.value,
      (val) => {
        if (val === false) {
          uninitInterval();
        }
      }
    );

    const mapProcs = () => props.blueprints;

    const validateProc = (proc) => {
      if (!proc.cmdType) {
        throw new Error("cmdType is required");
      }
      if (!proc.id) {
        throw new Error("id is required");
      }
    };

    const validateProcs = (procs) => {
      procs.forEach((p) => validateProc(p));
    };

    const CMD_TYPE_HASH = {
      [CMD_TYPES.BUILD_SUMMARIZED_WORK_ITEM_TREE]: (proc) =>
        structure({
          idempotencyId: proc.id,
          projectId: proc.projectId,
          cmdType: CMD_TYPES.BUILD_SUMMARIZED_WORK_ITEM_TREE,
          rootCollection: "epics",
        }),
      [CMD_TYPES.BUILD_WEIGHTED_WORK_ITEM_TREE]: (proc) =>
        structure({
          idempotencyId: proc.id,
          projectId: proc.projectId,
          cmdType: CMD_TYPES.BUILD_WEIGHTED_WORK_ITEM_TREE,
          rootCollection: "epics",
        }),
      [CMD_TYPES.GATHER_PROJECT_UNITS_OF_WORK]: (proc) =>
        gather({
          processId: proc.id,
          projectId: proc.projectId,
          ql: proc.ql,
        }),
      [CMD_TYPES.BULK_CREATE_UNITS_OF_WORK]: (proc) =>
        ext({
          idempotencyId: proc.id,
          projectId: proc.projectId,
          cmdType: CMD_TYPES.BULK_CREATE_UNITS_OF_WORK,
          cmdData: { cmds: proc.payload },
        }),
      [CMD_TYPES.CLONE_UNIT_OF_WORK]: (proc) =>
        ext({
          projectId: proc.projectId,
          idempotencyId: proc.id,
          cmdType: CMD_TYPES.CLONE_UNIT_OF_WORK,
          cmdData: { cmd: proc.payload },
        }),

      [CMD_TYPES.CREATE_DASHBOARD]: (proc) =>
        ext({
          idempotencyId: proc.id,
          projectId: proc.projectId,
          cmdType: CMD_TYPES.CREATE_DASHBOARD,
          cmdData: { cmd: proc.payload },
        }),
    };

    const handleRefreshClick = async () => {
      const procs = mapProcs();
      validateProcs(procs);
      // // console.log("handleRefreshClick", props.blueprints);
      processes.value = procs;

      if (procs.length) {
        await syncAll();
        processes.value = procs;
        executing.value = true;
        intervalId = initInterval();
        await Promise.all(procs.map((p) => CMD_TYPE_HASH[p.cmdType](p)));
      }
    };

    const procs = ref([]);

    const initTmpState = () => {
      for (let i = 0; i < 3; i++) {
        procs.value.push({
          id: i,
          status: statuses.value.RUNNING,
        });
        procs.value.push({
          id: i,
          status: statuses.value.COMPLETE,
        });
        procs.value.push({
          id: i,
          status: statuses.value.ERROR,
        });
      }
      executing.value = true;
    };

    onMounted(async () => {
      initTmpState();
      init();

      if (props.blueprints.length) {
        // // console.log("onMounted", "handleRefreshClick", props);
        await handleRefreshClick();
      }
    });

    return {
      ...toRefs(data),
      procs,
      processes,
      statuses,
      tab,
      executing,
      handleRefreshClick,
    };
  },
};
</script>
<style scoped></style>
