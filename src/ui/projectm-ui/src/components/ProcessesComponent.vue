<template>
  <div class="text-h4 q-mb-md">{{ title }}</div>
  <div class="q-pa-md">
    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        :active="active"
        v-for="i in blueprints"
        :key="i.id"
        :item="i"
      >
        <q-item-section>
          <q-item-label>{{ i.display || i.id }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ i.status }}</q-item-label>
        </q-item-section>
        <q-item-section avatar side v-if="i.status !== statuses.RUNNING">
          <q-icon
            color="yellow"
            v-if="i.status === statuses.RUNNING"
            name="run_circle"
          />
          <q-icon
            color="green"
            v-if="i.status === statuses.COMPLETE"
            name="check_small"
          />
          <q-icon
            color="red"
            v-if="i.status === statuses.ERROR"
            name="warning"
          />
        </q-item-section>
        <q-item-section side v-if="i.status === statuses.RUNNING">
          <q-circular-progress
            indeterminate
            size="30px"
            :thickness="0.3"
            color="lime"
            center-color="grey-8"
            class="q-mt-sm"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { ref } from "vue";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
export default {
  name: "ProcessesComponent",
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
  setup() {
    const statuses = ref(PROCESS_STATUSES);
    return {
      statuses,
    };
  },
};
</script>
<style scoped></style>
