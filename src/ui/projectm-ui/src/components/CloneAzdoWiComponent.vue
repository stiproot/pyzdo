<template>
  <div class="q-pa-md" v-if="!cloning">
    <q-form class="q-gutter-md" v-if="!isExpanded">
      <q-input
        v-model="id"
        label="Id *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Id is required']"
      />

      <q-input
        v-model="parentId"
        label="New Parent Id *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Parent ID is required']"
      />

      <q-input
        v-model="iterationPath"
        label="Iteration Path *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Iteration path is required']"
      />

      <q-input
        v-model="areaPath"
        label="Area Path *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Area path is required']"
      />

      <q-input v-model="tags" label="Additional Tags" lazy-rules />
    </q-form>

    <q-separator />

    <q-expansion-item
      v-if="!cloning"
      expand-separator
      v-model="isExpanded"
      icon="code"
      label="Payload"
    >
      <q-expansion-item-content>
        <q-input
          v-model="clonePayload"
          label="Clone Work Item Payload*"
          lazy-rules
          type="textarea"
          @blur="handlePayloadBlur"
          :rules="[(val) => (val && val.length) || 'Required']"
        />
      </q-expansion-item-content>
    </q-expansion-item>
  </div>

  <ProcessesComponent v-if="cloning" :blueprints="processes" />

  <BtnComponent
    class="float-right"
    icon="save"
    v-if="canClone"
    @click="handleCloneClick"
  />
</template>
<script>
import { computed, reactive, toRefs, ref, watch } from "vue";
import { generateGuid } from "@/services/guids.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import {
  useCloneAzdoWiStore,
  CloneAzdoWiProvider,
} from "@/stores/clone-azdo-wi.store";
import BtnComponent from "./BtnComponent.vue";
import ProcessesComponent from "./ProcessesComponent.vue";
import { getWiDetails } from "@/services/azdo.service";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";

export default {
  name: "CloneAzdoWiComponent",
  components: {
    BtnComponent,
    ProcessesComponent,
  },
  setup() {
    const store = useCloneAzdoWiStore();
    const provider = new CloneAzdoWiProvider(store);

    const {
      id,
      parentId,
      iterationPath,
      areaPath,
      tags,
      upsert,
      init,
      isValidState,
    } = provider;

    const processProvider = new ProcessProvider(useProcessStore());
    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const clonePayload = ref("");
    const cloning = ref(false);
    const canClone = computed(() => isValidState);

    const data = reactive({
      id,
      parentId,
      iterationPath,
      areaPath,
      tags,
      clonePayload,
      cloning,
      canClone,
      processes,
    });

    const isExpanded = ref(false);

    watch(
      () => parentId.value,
      async (newVal) => {
        if (!newVal) {
          return;
        }

        const wi = await getWiDetails(newVal);
        if (wi) {
          iterationPath.value = wi.fields["System.IterationPath"];
          areaPath.value = wi.fields["System.AreaPath"];
        }
      }
    );

    const handlePayloadBlur = () => {
      if (!clonePayload.value) {
        return;
      }

      const payload = JSON.parse(clonePayload.value);
      init(payload);
      clonePayload.value = "";
      isExpanded.value = false;
    };

    // const handleCloneClick = async () => {
    //   const idempotencyId = generateGuid();

    //   try {
    //     await upsert(idempotencyId);
    //     const procs = [
    //       {
    //         id: idempotencyId,
    //         project_id: "default",
    //         status: PROCESS_STATUSES.RUNNING,
    //         cmd_type: CMD_TYPES.CLONE_UNIT_OF_WORK,
    //       },
    //     ];

    //     cloningBlueprints.value = procs;
    //     cloning.value = true;
    //   } catch (ex) {
    //     // console.log(ex);
    //   }
    // };

    const handleCloneClick = async () => {
      const idempotencyId = generateGuid();
      const procs = [
        {
          id: idempotencyId,
          display: "Cloning Work Item Tree",
          project_id: "default",
          status: PROCESS_STATUSES.RUNNING,
          cmd_type: CMD_TYPES.CLONE_UNIT_OF_WORK,
        },
      ];

      processes.value = procs;
      cloning.value = true;

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
            handleCloneProcessesComplete();
          }, 2000);
        }
      }, 3000);
    };

    const handleCloneProcessesComplete = () => {
      clonePayload.value = "";
      processes.value = [];
      cloning.value = false;
      init();
    };

    return {
      ...toRefs(data),
      isExpanded,
      handlePayloadBlur,
      handleCloneClick,
      handleCloneProcessesComplete,
    };
  },
};
</script>
<style>
.float-right {
  float: right;
}
</style>
