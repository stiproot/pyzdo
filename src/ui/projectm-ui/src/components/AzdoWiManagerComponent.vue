<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <q-tabs v-model="tab" vertical class="text-teal">
        <q-tab name="bulk" icon="code" label="" />
        <q-tab name="clone" icon="category" label="" />
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
        <q-tab-panel name="bulk">
          <div class="text-h4 q-mb-md">Bulk Create</div>
          <BulkCreateAzdoWisComponent />
        </q-tab-panel>

        <q-tab-panel name="clone">
          <div class="text-h4 q-mb-md">Clone</div>
          <CloneAzdoWiComponent />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>
<script>
import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import CloneAzdoWiComponent from "./CloneAzdoWiComponent.vue";
import BulkCreateAzdoWisComponent from "./BulkCreateAzdoWisComponent.vue";
export default {
  name: "AzdoWiManagerComponent",
  components: {
    CloneAzdoWiComponent,
    BulkCreateAzdoWisComponent,
  },
  props: {
    tabId: {
      type: String,
      default: () => "bulk",
    },
  },
  setup(props) {
    const router = useRouter();

    const tab = ref(props.tabId);
    watch(
      () => tab.value,
      (val) => {
        router.replace({ query: { tab: val } });
      }
    );

    return {
      tab,
    };
  },
};
</script>
<style>
.float-right {
  float: right;
}
</style>
