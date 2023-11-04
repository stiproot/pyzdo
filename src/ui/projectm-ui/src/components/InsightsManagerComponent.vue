<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="gather" icon="code" label="" />
          <q-tab name="structure" icon="category" label="" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="gather">
            <div class="text-h4 q-mb-md">Queries</div>
            <div class="q-pa-md">
              <QueryManagerComponent v-if="!gathering" />
              <ProcessManagerComponent
                v-if="gathering"
                @processes-complete="handleGatherProcessesComplete"
                :blueprints="queryBlueprints"
              />
            </div>
            <div class="q-pa-md">
              <BtnComponent
                class="float-right"
                icon="replay"
                @click="handleGatherAllClick"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="structure">
            <div class="text-h4 q-mb-md">Structures</div>
            <div class="q-pa-md">
              <StructureManagerComponent v-if="!structuring" />
              <ProcessManagerComponent
                v-if="structuring"
                :blueprints="structureBlueprints"
                @processes-complete="handleStructureProcessesComplete"
              />
            </div>
            <div class="q-pa-md">
              <BtnComponent
                class="float-right"
                icon="replay"
                @click="handleStructureAllClick"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script>
import { watch, onMounted, reactive, toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import { generateGuid } from "@/services/guids.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import {
  useProjectDetailsStore,
  ProjectDetailsProvider,
} from "@/stores/project-details.store";
import {
  useStructuresStore,
  StructuresProvider,
} from "@/stores/structures.store";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import BtnComponent from "./BtnComponent.vue";
import QueryManagerComponent from "./QueryManagerComponent.vue";
import StructureManagerComponent from "./StructureManagerComponent.vue";
import ProcessManagerComponent from "./ProcessManagerComponent.vue";
export default {
  name: "InsightsManagerComponent",
  components: {
    BtnComponent,
    QueryManagerComponent,
    StructureManagerComponent,
    ProcessManagerComponent,
  },
  props: {
    tabId: {
      type: String,
      default: () => "gather",
    },
  },
  setup(props) {
    const router = useRouter();
    const nav = new NavigationService(router);
    const projectStore = useProjectDetailsStore();
    const projectProvider = new ProjectDetailsProvider(projectStore);
    const structuresStore = useStructuresStore();
    const structuresProvider = new StructuresProvider(structuresStore);

    const { structures } = structuresProvider;
    const { id, name, description, owner, queries } = projectProvider;

    const data = reactive({
      id,
      name,
      description,
      owner,
      queries,
    });

    const tab = ref(props.tabId);
    watch(
      () => tab.value,
      (val) => {
        router.replace({ query: { tab: val } });
      }
    );

    const gathering = ref(false);
    const structuring = ref(false);
    const queryBlueprints = ref([]);
    const structureBlueprints = ref([]);
    const handleGatherAllClick = () => {
      const procs = queries.value.map((i) => {
        return {
          id: generateGuid(),
          projectId: nav.projId,
          status: PROCESS_STATUSES.RUNNING,
          cmdType: CMD_TYPES.GATHER_PROJECT_UNITS_OF_WORK,
          ql: i.ql,
          __metadata__: {
            project_id: nav.projId,
          },
        };
      });

      queryBlueprints.value = procs;
      gathering.value = true;
    };

    const CMD_TYPE_HASH = {
      summarized_tree: CMD_TYPES.BUILD_SUMMARIZED_WORK_ITEM_TREE,
      weighted_tree: CMD_TYPES.BUILD_WEIGHTED_WORK_ITEM_TREE,
    };

    const handleStructureAllClick = () => {
      const procs = structures.value.map((i) => {
        return {
          id: generateGuid(),
          projectId: nav.projId,
          status: PROCESS_STATUSES.RUNNING,
          cmdType: CMD_TYPE_HASH[i.id],
          __metadata__: {
            project_id: nav.projId,
          },
        };
      });

      structureBlueprints.value = procs;
      structuring.value = true;
    };

    const handleStructureProcessesComplete = () => {
      structureBlueprints.value = [];
      structuring.value = false;
    };

    const handleGatherProcessesComplete = () => {
      queryBlueprints.value = [];
      gathering.value = false;
    };

    onMounted(async () => {
      // // console.log("InsightsManagerComponent mounted", props.tabId);
      // // console.log(nav.projId);
      await projectProvider.init(nav.projId);
      await structuresProvider.init(nav.projId);
    });

    return {
      ...toRefs(data),
      tab,
      gathering,
      structuring,
      queryBlueprints,
      structureBlueprints,
      handleGatherAllClick,
      handleStructureAllClick,
      handleStructureProcessesComplete,
      handleGatherProcessesComplete,
    };
  },
};
</script>
<style>
.float-right {
  float: right;
}
</style>
