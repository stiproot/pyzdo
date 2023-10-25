<template>
  <div class="text-h4 q-mb-md">Dashboards</div>
  <div v-if="!creating" class="q-pa-md">
    <InitiativeComponent
      :value="initiativeModel"
      v-if="showInitiative"
      @updated="handleInitiativeUpdated"
    />
    <BtnComponent
      class="float-right"
      v-if="showInitiative"
      icon="close"
      @click="handleCloseClick"
    />
    <q-form class="q-gutter-md" v-if="!showInitiative && !isExpanded">
      <q-input
        v-model="dashboardName"
        label="Dashboard Name *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Dashboard name is required']"
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
        v-model="queryFolderBasePath"
        label="Query folder base path *"
        lazy-rules
        :rules="[
          (val) => (val && val.length) || 'Query folder base path is required',
        ]"
      />

      <q-btn
        v-if="!showInitiative"
        icon="add"
        @click="handleAddClick"
        color="white"
        text-color="black"
        label="Add Initiative"
      />

      <div v-if="!showInitiative">
        <q-card
          dark
          bordered
          class="bg-grey-9 card-width"
          v-for="i in initiatives"
          :key="i.tag"
        >
          <q-card-section>
            <div class="text-h6">{{ i.title }}</div>
            <div class="text-subtitle2">{{ i.tag }}</div>
          </q-card-section>
          <q-separator dark inset />
          <q-card-section>{{ i.desc }}</q-card-section>
        </q-card>
      </div>
    </q-form>

    <q-separator />

    <q-expansion-item
      v-if="!showInitiative && !creating"
      expand-separator
      v-model="isExpanded"
      icon="code"
      label="Payload"
    >
      <q-expansion-item-content>
        <q-input
          v-model="createPayload"
          label="Dashboard Payload *"
          lazy-rules
          type="textarea"
          @blur="handlePayloadBlur"
          :rows="10"
          :rules="[(val) => (val && val.length) || 'Required']"
        />
      </q-expansion-item-content>
    </q-expansion-item>
  </div>

  <ProcessOrchestratorComponent
    v-if="creating"
    :blueprints="blueprints"
    @processes-complete="handleCreateProcessesComplete"
  />

  <BtnComponent
    class="float-right"
    icon="save"
    v-if="canCreate && !creating && !showInitiative"
    @click="handleCreateClick"
  />
</template>
<script>
import { computed, onMounted, reactive, toRefs, ref } from "vue";
import { generateGuid } from "@/services/guids.service";
import { CMD_TYPES } from "@/services/cmd-types.enum";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import BtnComponent from "./BtnComponent.vue";
import ProcessOrchestratorComponent from "./ProcessOrchestratorComponent.vue";
import InitiativeComponent from "./InitiativeComponent.vue";
import {
  useCreateAzdoDashboardStore,
  CreateAzdoDashboardProvider,
} from "@/stores/create-azdo-dashboard.store";
export default {
  name: "AzdoDashboardComponent",
  components: {
    BtnComponent,
    ProcessOrchestratorComponent,
    InitiativeComponent,
  },
  setup() {
    const store = useCreateAzdoDashboardStore();
    const provider = new CreateAzdoDashboardProvider(store);

    const createPayload = ref("");
    const blueprints = ref([]);
    const creating = ref(false);
    const isExpanded = ref(false);
    const showInitiative = ref(false);

    const defaultInitiativeState = () => ({
      title: "",
      tag: "",
      desc: "",
      queryFolderName: "",
    });

    const {
      dashboardName,
      iterationName,
      iterationBasePath,
      teamName,
      queryFolderBasePath,
      initiatives,
      isValidState,
      init,
      addInitiative,
      removeInitiative,
      upsert,
    } = provider;

    const canCreate = computed(() => isValidState);

    const data = reactive({
      dashboardName,
      iterationName,
      iterationBasePath,
      teamName,
      queryFolderBasePath,
      initiatives,
      createPayload,
      blueprints,
      creating,
      canCreate,
    });

    const initiativeModel = ref(defaultInitiativeState());

    const resetInitiativeModel = () => {
      initiativeModel.value = defaultInitiativeState();
    };

    const handleAddClick = () => {
      resetInitiativeModel();
      showInitiative.value = true;
    };

    const handleCloseClick = () => {
      resetInitiativeModel();
      showInitiative.value = false;
    };

    const handlePayloadBlur = () => {
      if (!createPayload.value) {
        return;
      }

      const payload = JSON.parse(createPayload.value);
      init(payload);
      createPayload.value = "";
      isExpanded.value = false;
    };

    const mergeInitiatives = (val) => {
      const existing = initiatives.value.find((i) => i.tag === val.tag);

      if (existing) {
        existing.title = val.title;
        existing.desc = val.desc;
        existing.queryFolderName = val.queryFolderName;
        removeInitiative(existing);
        addInitiative(existing);
        return;
      }

      initiatives.value.push(val);
    };

    const handleInitiativeUpdated = (val) => {
      mergeInitiatives(val);
      resetInitiativeModel();
      showInitiative.value = false;
    };

    const handleCreateClick = async () => {
      const idempotencyId = generateGuid();

      try {
        await upsert(idempotencyId);
        const procs = [
          {
            id: idempotencyId,
            project_id: "default",
            status: PROCESS_STATUSES.RUNNING,
            cmd_type: CMD_TYPES.CREATE_DASHBOARD,
          },
        ];

        blueprints.value = procs;
        creating.value = true;
      } catch (e) {
        console.log(e);
      }
    };

    const handleCreateProcessesComplete = () => {
      blueprints.value = [];
      createPayload.value = "";
      creating.value = false;
      init();
    };

    onMounted(async () => {
      console.log("AzdoDashboardComponent mounted");
    });

    return {
      ...toRefs(data),
      initiativeModel,
      showInitiative,
      isExpanded,
      handleCreateClick,
      handleCreateProcessesComplete,
      handleAddClick,
      handleCloseClick,
      handleInitiativeUpdated,
      handlePayloadBlur,
    };
  },
};
</script>
<style>
.float-right {
  float: right;
}

.float-left {
  float: left;
}

.card-width {
  width: 100%;
  max-width: 250px;
}
</style>
