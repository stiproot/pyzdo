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
        label="Parent Id *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Parent ID is required']"
      />

      <q-input
        v-model="iterationName"
        label="Iteration Name *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Iteration name is required']"
      />

      <q-input
        v-model="iterationBasePath"
        label="Iteration Path *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Iteration path is required']"
      />

      <q-input
        v-model="teamName"
        label="Team Name *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Team name is required']"
      />

      <q-input
        v-model="areaPath"
        label="Area Path *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Area path is required']"
      />

      <q-input
        v-model="tags"
        label="Tags *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Tags are required']"
      />
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

  <ProcessOrchestratorComponent
    v-if="cloning"
    :blueprints="cloningBlueprints"
    @processes-complete="handleCloneProcessesComplete"
  />

  <BtnComponent
    class="float-right"
    icon="save"
    v-if="canClone"
    @click="handleCloneClick"
  />
</template>
<script>
import { computed, reactive, toRefs, ref } from "vue";
import { generateGuid } from "@/services/guids.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import {
  useCloneAzdoWiStore,
  CloneAzdoWiProvider,
} from "@/stores/clone-azdo-wi.store";
import BtnComponent from "./BtnComponent.vue";
import ProcessOrchestratorComponent from "./ProcessOrchestratorComponent.vue";
export default {
  name: "CloneAzdoWiComponent",
  components: {
    BtnComponent,
    ProcessOrchestratorComponent,
  },
  setup() {
    const store = useCloneAzdoWiStore();
    const provider = new CloneAzdoWiProvider(store);

    const {
      id,
      parentId,
      iterationName,
      iterationBasePath,
      teamName,
      areaPath,
      tags,
      upsert,
      init,
      isValidState,
    } = provider;

    const clonePayload = ref("");
    const cloningBlueprints = ref([]);
    const cloning = ref(false);
    const canClone = computed(() => isValidState);

    const data = reactive({
      id,
      parentId,
      iterationName,
      iterationBasePath,
      teamName,
      areaPath,
      tags,
      clonePayload,
      cloningBlueprints,
      cloning,
      canClone,
    });

    const isExpanded = ref(false);

    const handlePayloadBlur = () => {
      if (!clonePayload.value) {
        return;
      }

      const payload = JSON.parse(clonePayload.value);
      init(payload);
      clonePayload.value = "";
      isExpanded.value = false;
    };

    const handleCloneClick = async () => {
      const idempotencyId = generateGuid();

      try {
        await upsert(idempotencyId);
        const procs = [
          {
            id: idempotencyId,
            project_id: "default",
            status: PROCESS_STATUSES.RUNNING,
            cmd_type: CMD_TYPES.CLONE_UNIT_OF_WORK,
          },
        ];

        cloningBlueprints.value = procs;
        cloning.value = true;
      } catch (ex) {
        console.log(ex);
      }
    };

    const handleCloneProcessesComplete = () => {
      clonePayload.value = "";
      cloningBlueprints.value = [];
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
