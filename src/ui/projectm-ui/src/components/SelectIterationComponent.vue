<template>
  <q-select
    clearable
    use-input
    v-model="model"
    input-debounce="300"
    :label="label"
    :options="options"
    :option-label="`${optionLabel}`"
    @filter="filterFn"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import {
  useIterationsStore,
  IterationsProvider,
} from "@/stores/iterations.store";
export default {
  name: "SelectIterationComponent",
  props: {
    label: String,
    optionValue: String,
    optionLabel: String,
    default: Object,
    teamName: String,
  },
  setup(props, { emit }) {
    const store = useIterationsStore();
    const provider = new IterationsProvider(store);

    const { iterations, filter } = provider;

    const options = ref([]);
    const model = ref();

    const emitEvent = () => {
      const safe = model.value || props.default;
      emit("selected", safe);
    };

    watch(
      () => model.value,
      () => emitEvent()
    );

    async function filterFn(val, update) {
      if (val.length === 0) {
        update(() => {
          options.value = iterations.value;
        });
      }

      const res = await filter(val);
      options.value = res;
      update(() => {
        options.value = res;
      });
    }

    onMounted(async () => {
      await provider.init(props.teamName);
      options.value = iterations.value;
    });

    return {
      model,
      options,
      filterFn,
    };
  },
};
</script>
<style></style>
