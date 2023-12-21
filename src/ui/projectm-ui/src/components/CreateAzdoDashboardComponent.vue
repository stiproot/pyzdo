<template>
  <q-dialog v-model="searching">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Search</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <SelectTeamComponent
          @selected="handleTeamSelect"
          default=""
          label="Name"
          optionValue="id"
          optionLabel="name"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="searchingIterations">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Search</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <SelectIterationComponent
          @selected="handleIterationSelect"
          default=""
          label="Iterations"
          optionValue="id"
          optionLabel="name"
          :team-name="teamName"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

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
        v-model="teamName"
        label="Team Name *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Team name is required']"
      >
        <template v-slot:after>
          <q-btn
            round
            color="primary"
            icon="search"
            @click="searching = true"
          />
        </template>
      </q-input>

      <q-input
        v-model="iterationPath"
        label="Iteration Path *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Iteration path is required']"
      >
        <template v-slot:after>
          <q-btn
            round
            color="primary"
            icon="search"
            @click="searchingIterations = true"
          />
        </template>
      </q-input>

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

          <q-card-actions>
            <q-btn flat @click="handleRemoveInitiativeClick(i)">Remove</q-btn>
          </q-card-actions>
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

  <ProcessesComponent v-if="creating" :blueprints="processes" />

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
import ProcessesComponent from "./ProcessesComponent.vue";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";
import SelectTeamComponent from "./SelectTeamComponent.vue";
import SelectIterationComponent from "./SelectIterationComponent.vue";
import InitiativeComponent from "./InitiativeComponent.vue";
import {
  useCreateAzdoDashboardStore,
  CreateAzdoDashboardProvider,
} from "@/stores/create-azdo-dashboard.store";
export default {
  name: "AzdoDashboardComponent",
  components: {
    BtnComponent,
    ProcessesComponent,
    InitiativeComponent,
    SelectTeamComponent,
    SelectIterationComponent,
  },
  setup() {
    const provider = new CreateAzdoDashboardProvider(
      useCreateAzdoDashboardStore()
    );
    const {
      dashboardName,
      iterationPath,
      teamName,
      queryFolderBasePath,
      initiatives,
      isValidState,
      init,
      addInitiative,
      removeInitiative,
      upsert,
    } = provider;

    const processProvider = new ProcessProvider(useProcessStore());
    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const createPayload = ref("");
    const creating = ref(false);
    const isExpanded = ref(false);
    const showInitiative = ref(false);
    const searching = ref(false);
    const searchingIterations = ref(false);

    const defaultInitiativeState = () => ({
      title: "",
      tag: "",
      desc: "",
    });

    const canCreate = computed(() => isValidState);

    const data = reactive({
      dashboardName,
      iterationPath,
      teamName,
      queryFolderBasePath,
      initiatives,
      createPayload,
      creating,
      canCreate,
      searching,
      searchingIterations,
      processes,
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

    const handleTeamSelect = (item) => {
      if (!item || item === "") {
        return;
      }

      teamName.value = item.name;
      searching.value = false;
    };

    const handleIterationSelect = (item) => {
      if (!item || item === "") {
        return;
      }

      iterationPath.value = item.path;
      searchingIterations.value = false;
    };

    const mergeInitiatives = (val) => {
      console.log("val", val);
      console.log("initiatives", initiatives);
      const existing = initiatives.value.find((i) => i.tag === val.tag);
      console.log("existing", existing);

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

    const handleRemoveInitiativeClick = (val) => {
      // mergeInitiatives(val);
      removeInitiative(val);
      // resetInitiativeModel();
      // showInitiative.value = false;
    };

    const handleCreateClick = async () => {
      const idempotencyId = generateGuid();
      const procs = [
        {
          id: idempotencyId,
          display: "Creating dashboard",
          project_id: "default",
          status: PROCESS_STATUSES.RUNNING,
          cmd_type: CMD_TYPES.CREATE_DASHBOARD,
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
      processes.value = [];
      createPayload.value = "";
      creating.value = false;
      init();
    };

    onMounted(async () => {
      // console.log("AzdoDashboardComponent mounted");
    });

    return {
      ...toRefs(data),
      initiativeModel,
      showInitiative,
      isExpanded,
      handleCreateClick,
      handleRemoveInitiativeClick,
      handleCreateProcessesComplete,
      handleAddClick,
      handleCloseClick,
      handleInitiativeUpdated,
      handlePayloadBlur,
      handleTeamSelect,
      handleIterationSelect,
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
