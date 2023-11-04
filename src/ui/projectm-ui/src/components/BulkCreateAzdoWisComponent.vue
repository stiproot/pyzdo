<template>
  <div v-if="!creating" class="q-pa-md">
    <q-form class="q-gutter-md">
      <q-input
        v-model="wis"
        label="Work Item Payload *"
        lazy-rules
        type="textarea"
        rows="10"
        :rules="[(val) => (val && val.length) || 'Required']"
      />
    </q-form>
  </div>

  <ProcessesComponent v-if="creating" :blueprints="processes" />

  <BtnComponent
    class="float-right"
    icon="save"
    v-if="wis"
    @click="handleCreateClick"
  />
</template>
<script>
import { reactive, toRefs, ref } from "vue";
import { generateGuid } from "@/services/guids.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import BtnComponent from "./BtnComponent.vue";
import ProcessesComponent from "./ProcessesComponent.vue";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";
import {
  useBulkCreateAzdoWisStore,
  BulkCreateAzdoWisProvider,
} from "@/stores/bulk-create-azdo-wis.store";
export default {
  name: "BulkCreateAzdoWisComponent",
  components: {
    BtnComponent,
    ProcessesComponent,
  },
  setup() {
    const store = useBulkCreateAzdoWisStore();
    const provider = new BulkCreateAzdoWisProvider(store);
    const { init, upsert, wis } = provider;

    const processProvider = new ProcessProvider(useProcessStore());
    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const payload = ref("");
    const creating = ref(false);

    const data = reactive({
      wis,
      payload,
      creating,
      processes,
    });

    // const handleCreateClick = async () => {
    //   const idempotencyId = generateGuid();
    //   try {
    //     await upsert(idempotencyId);
    //     const procs = [
    //       {
    //         id: idempotencyId,
    //         project_id: "default",
    //         status: PROCESS_STATUSES.RUNNING,
    //         cmd_type: CMD_TYPES.BULK_CREATE_UNITS_OF_WORK,
    //         key: idempotencyId,
    //       },
    //     ];

    //     blueprints.value = procs;
    //     creating.value = true;
    //   } catch (e) {
    //     // console.log(e);
    //   }
    // };

    const handleCreateClick = async () => {
      const idempotencyId = generateGuid();
      const procs = [
        {
          id: idempotencyId,
          display: "Builk creating work items",
          project_id: "default",
          status: PROCESS_STATUSES.RUNNING,
          cmd_type: CMD_TYPES.BULK_CREATE_UNITS_OF_WORK,
        },
      ];

      processes.value = procs;
      creating.value = true;

      await syncAll();
      await upsert(idempotencyId);

      initProcessInterval();
    };

    const initProcessInterval = () => {
      let intervalId = setInterval(async () => {
        if (isStillRunning.value) {
          await refresh();
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            handleCreateProcessesComplete();
          }, 2000);
        }
      }, 3000);
    };

    const handleCreateProcessesComplete = () => {
      init();
      processes.value = [];
      creating.value = false;
    };

    return {
      ...toRefs(data),
      handleCreateClick,
      handleCreateProcessesComplete,
    };
  },
};
</script>
<style>
.float-right {
  float: right;
}
</style>
