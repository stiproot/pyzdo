<template>
  <TreeComponent :data="tree" />
  <slot />
</template>
<script>
import { computed } from "vue";
import {
  useStructureStagingStore,
  StructureStagingProvider,
} from "@/stores/structure-staging.store.js";
import TreeComponent from "@/components/TreeComponent.vue";

export default {
  name: "StructureComponent",
  components: {
    TreeComponent,
  },
  setup() {
    const store = useStructureStagingStore();
    const provider = new StructureStagingProvider(store);
    const { staged } = provider;
    const tree = computed(() => [staged.value.structure]);

    return {
      tree,
    };
  },
};
</script>
<style></style>
