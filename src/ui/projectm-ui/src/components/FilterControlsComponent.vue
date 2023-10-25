<template>
  <div class="q-pa-md">
    <SliderFilterComponent
      :minVal="0"
      :stepVal="5"
      :maxVal="40"
      @adjusted="handleRiskWeightAdjusted"
    />
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <SelectFilterComponent
        label="Role"
        :options="roleOptions"
        @selected="handleRoleSelected"
      />
      <SelectFilterComponent
        label="RAG"
        :options="ragOptions"
        @selected="handleRagSelected"
      />
      <SelectFilterComponent
        label="Severity"
        :options="severityOptions"
        @selected="handleSeveritySelected"
      />
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import SliderFilterComponent from "./SliderFilterComponent.vue";
import SelectFilterComponent from "./SelectFilterComponent.vue";
export default {
  name: "FilterControlsComponent",
  components: {
    SliderFilterComponent,
    SelectFilterComponent,
  },
  setup(props, { emit }) {
    const emitEvent = (data) => {
      emit("filter", data);
    };

    const roles = ["Developer", "SDET", "Project Manager", "SEM", "BA"];
    const roleOptions = ref(roles);

    const rags = ["Red", "Amber", "Green"];
    const ragOptions = ref(rags);

    const severities = [
      { label: "(1) Negligible", value: 1 },
      { label: "(2) Minor", value: 2 },
      { label: "(3) Moderate", value: 3 },
      { label: "(4) Major", value: 4 },
      { label: "(5) Catastrophic", value: 5 },
    ];
    const severityOptions = ref(severities);

    const filter = {
      severities: severities,
      roles: roles,
      rags: rags,
      risk_weight: 0,
    };

    const triggerFilter = () => {
      console.log("triggerFilter", filter);
      emitEvent(filter);
    };

    const handleRiskWeightAdjusted = (e) => {
      console.log("handleRiskWeightAdusted", e);
      filter.risk_weight = e;
      triggerFilter();
    };

    const handleRagSelected = (e) => {
      console.log("handleRagSelected", e);
      filter.rags = e;
      triggerFilter();
    };

    const handleRoleSelected = (e) => {
      console.log("handleRoleSelected", e);
      filter.roles = e;
      triggerFilter();
    };

    const handleSeveritySelected = (e) => {
      console.log("handleSeveritySelected", e);
      filter.severities = e;
      triggerFilter();
    };

    onMounted(() => {
      console.log("FilterControlsComponent", "mounted");
      triggerFilter();
    });

    return {
      roleOptions,
      ragOptions,
      severityOptions,
      handleRiskWeightAdjusted,
      handleRagSelected,
      handleRoleSelected,
      handleSeveritySelected,
    };
  },
};
</script>
<style></style>
