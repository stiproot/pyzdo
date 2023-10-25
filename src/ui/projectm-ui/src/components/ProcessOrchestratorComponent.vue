<template>
  <ProcessesComponent title="procs" :blueprints="processes" />
</template>
<script>
import { onMounted, watch, reactive, toRefs, ref } from "vue";
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
    const processStore = useProcessStore();
    const processProvider = new ProcessProvider(processStore);

    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const data = reactive({
      processes,
      isStillRunning,
    });

    const procs = ref([]);
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
        if (data.isStillRunning) {
          console.log("still running");
          await refresh();
        } else {
          console.log("not still running");
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

    const start = async () => {
      if (props.blueprints && props.blueprints.length) {
        console.log("starting", props.blueprints);
        processes.value = props.blueprints;
        await syncAll();
        executing.value = true;
        intervalId = initInterval();
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
