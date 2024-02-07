<template>
  <div class="q-pa-md" v-if="!processing">
    <q-form class="q-gutter-md">
      <q-input
        v-model="id"
        label="Id *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Root Id is required']"
      />

      <q-input
        v-model="tags"
        label="Tags *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Tags are required']"
      />

    </q-form>
  </div>

  <ProcessesComponent v-if="processing" :blueprints="processes" />

  <BtnComponent
    class="float-right"
    icon="save"
    v-if="canProcess"
    @click="handleProcessClick"
  />
</template>
<script>
import { computed, reactive, toRefs, ref } from "vue";
import { generateGuid } from "@/services/guids.service";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import BtnComponent from "./BtnComponent.vue";
import ProcessesComponent from "./ProcessesComponent.vue";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";
import { ext } from "@/services/azdo-proxy.service";

export default {
  name: "UpdateAzdoWiComponent",
  components: {
    BtnComponent,
    ProcessesComponent,
  },
  setup() {

    const processProvider = new ProcessProvider(useProcessStore());
    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const processing = ref(false);
    const id = ref(null);
    const tags = ref(null);
    const canProcess = computed(() => id.value && tags.value);

    const data = reactive({
      id,
      tags,
      processing,
      canProcess,
      processes,
    });

    const mapCmds = () => {

      const items = [
        {
          id: id.value,
          tags: tags.value
        }
      ];

      const procs = items.map(n => ({
          id: generateGuid(),
          display: `Updating Work Item Hierarchy: Adding tags -> ${n.tags}`,
          project_id: "default",
          status: PROCESS_STATUSES.RUNNING,
          cmd_type: CMD_TYPES.UPDATE_UNIT_OF_WORK_HIERARCHY,
          unit_of_work_id: n.id,
          tags: n.tags,
        }));

      const cmds = procs.map(p => ({
        idempotencyId: p.id,
        projectId: "default",
        cmdType: p.cmd_type,
        cmdData: { 
          cmd: {
            id: p.unit_of_work_id, 
            tags: p.tags, 
            // history: `(Automated) Adding of tags: ${p.tags}%`
          }
        }
      }));

      return { procs: procs, cmds: cmds };
    };

    const initProcessInterval = () => {
      let intervalId = setInterval(async () => {
        if (isStillRunning.value) {
          await refresh();
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            handleProcessComplete();
          }, 2000);
        }
      }, 3000);
    };

    const handleProcessComplete = () => {
      initState();
      processes.value = [];
      processing.value = false;
    };

    const executeProcs = async (procs, cmds) => {

      processes.value = procs;
      processing.value = true;

      await syncAll();

      await Promise.all(cmds.map((cmd) => ext(cmd)));

      initProcessInterval();
    }

    const handleProcessClick = async () => {
      const { procs, cmds } = mapCmds();
      await executeProcs(procs, cmds);
    };

    const initState = () => {
      id.value = null;
      tags.value = null;
    }

    return {
      ...toRefs(data),
      handleProcessClick,
      handleProcessComplete,
    };
  },
};
</script>
<style>
.float-right {
  float: right;
}
.q-expansion-item {
  border: 1px solid #ccc; /* Customize the border style and color */
  border-radius: 5px; /* Optional: Add border-radius for rounded corners */
}
</style>
