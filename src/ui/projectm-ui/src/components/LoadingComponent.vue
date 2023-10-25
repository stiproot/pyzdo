<template>
  <q-ajax-bar
    ref="bar"
    position="bottom"
    color="accent"
    size="10px"
    skip-hijack
  />
</template>
<script>
import { ref, watch, reactive } from "vue";
import { useLoadingStore, LoadingProvider } from "@/stores/loading.store.js";
export default {
  name: "LoadingComponent",
  setup() {
    const store = useLoadingStore();
    const provider = new LoadingProvider(store);
    const { isLoading } = provider;
    const data = reactive({ isLoading });
    const barTimoutMs = 1000;
    const bar = ref(null);

    watch(
      () => data.isLoading,
      (_new, _old) => {
        if (_new === _old) return;
        const barRef = bar.value;
        if (_new) {
          barRef.start();
          setTimeout(() => {
            data.isLoading = false;
          }, barTimoutMs);
        } else barRef.stop();
      }
    );

    return { bar };
  },
};
</script>

<style scoped></style>
