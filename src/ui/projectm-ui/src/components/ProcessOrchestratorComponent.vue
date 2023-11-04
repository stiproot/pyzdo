<template>
  <ProcessesComponent title="procs" :blueprints="processes" />
</template>
<script>
import { onMounted, reactive, toRefs, ref } from "vue";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";
import ProcessesComponent from "./ProcessesComponent.vue";
export default {
  name: "ProcessOrchestratorComponent",
  components: {
    ProcessesComponent,
  },
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
    const processProvider = new ProcessProvider(useProcessStore());

    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const data = reactive({
      processes,
      isStillRunning,
    });

    const procs = ref([]);
    const executing = ref(false);

    function emitEvent() {
      emit("processes-complete", {});
    }

    function initInterval() {
      let intervalId = setInterval(async () => {
        if (data.isStillRunning) {
          // console.log("still running");
          await refresh();
        } else {
          // console.log("not still running");
          executing.value = false;
          clearInterval(intervalId);
          emitEvent();
        }
      }, 3000);
    }

    const start = async () => {
      if (props.blueprints && props.blueprints.length) {
        // console.log("starting", props.blueprints);
        processes.value = props.blueprints;
        await syncAll();
        executing.value = true;
        initInterval();
      }
    };

    onMounted(async () => {
      await start();
    });

    return {
      ...toRefs(data),
      procs,
      processes,
      executing,
    };
  },
};
</script>
<style scoped></style>
