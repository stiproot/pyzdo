<template>
  <div class="q-pa-md">
    <q-toggle v-model="or" color="blue" :label="toggleLabel" />

    <SelectFilterComponent
      label="Tags"
      :options="model"
      @selected="handleTagSelected"
    />
  </div>
</template>
<script>
import { toRefs, reactive, ref, onMounted, watch } from "vue";
import SelectFilterComponent from "./SelectFilterComponent.vue";
export default {
  name: "TagFilterComponent",
  components: {
    SelectFilterComponent,
  },
  props: { label: String, options: Array },
  setup(props, { emit }) {
    const model = ref(props.options);

    const emitEvent = (data) => {
      emit("selected", data);
    };

    const or = ref(true);
    const toggleLabel = ref("Or");

    const data = reactive({
      model,
      or,
      toggleLabel,
    });

    const filter = {
      tags: model.value,
      or: or.value,
    };

    watch(
      () => or.value,
      (val) => {
        filter.or = val;
        toggleLabel.value = val ? "Or" : "And";
        triggerFilter();
      }
    );

    let setTimeoutId = 0;
    const triggerFilter = () => {
      if (setTimeoutId) {
        clearTimeout(setTimeoutId);
      }

      setTimeoutId = setTimeout(() => {
        emitEvent(filter);
        clearTimeout(setTimeoutId);
      }, 1000);
    };

    const handleTagSelected = (e) => {
      filter.tags = e;
      triggerFilter();
    };

    onMounted(() => {
      triggerFilter();
    });

    return {
      ...toRefs(data),
      handleTagSelected,
    };
  },
};
</script>
<style></style>
