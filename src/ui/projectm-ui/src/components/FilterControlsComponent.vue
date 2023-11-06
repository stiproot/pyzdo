<template>
  <div class="q-pa-md">
    <RangeFilterComponent
      :minVal="0"
      :stepVal="5"
      :maxVal="50"
      @adjusted="handleRiskImpactAdjusted"
    />
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <SelectFilterComponent
        label="Area"
        :options="areaOptions"
        @selected="handleAreaSelected"
      />
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
      <q-toggle v-model="defaulted" color="red" label="Defaulted" />
    </div>
  </div>
</template>
<script>
import { toRefs, reactive, ref, onMounted, watch } from "vue";
import RangeFilterComponent from "./RangeFilterComponent.vue";
import SelectFilterComponent from "./SelectFilterComponent.vue";
export default {
  name: "FilterControlsComponent",
  components: {
    RangeFilterComponent,
    SelectFilterComponent,
  },
  setup(props, { emit }) {
    const emitEvent = (data) => {
      emit("filter", data);
    };

    const areas = [
      "Artifacts",
      "Behaviours",
      "Development",
      "Environments",
      "Project",
      "Personnel",
      "Testing",
    ];
    const areaOptions = ref(areas);
    const roles = [
      "Developer",
      "SDET",
      "Project Manager",
      "SEM",
      "Business Analyst",
    ];
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
    const defaulted = ref(false);

    const data = reactive({
      areaOptions,
      severityOptions,
      roleOptions,
      ragOptions,
      defaulted,
    });

    const filter = {
      areas: areas,
      severities: severities,
      roles: roles,
      rags: rags,
      risk_impact_range: { min: 0, max: 50 },
      defaulted: false,
    };

    watch(
      () => defaulted.value,
      (val) => {
        filter.defaulted = val;
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

    const handleRiskImpactAdjusted = (e) => {
      filter.risk_impact_range = e;
      triggerFilter();
    };

    const handleAreaSelected = (e) => {
      filter.areas = e;
      triggerFilter();
    };

    const handleRagSelected = (e) => {
      filter.rags = e;
      triggerFilter();
    };

    const handleRoleSelected = (e) => {
      filter.roles = e;
      triggerFilter();
    };

    const handleSeveritySelected = (e) => {
      filter.severities = e;
      triggerFilter();
    };

    onMounted(() => {
      triggerFilter();
    });

    return {
      ...toRefs(data),
      handleAreaSelected,
      handleRiskImpactAdjusted,
      handleRagSelected,
      handleRoleSelected,
      handleSeveritySelected,
    };
  },
};
</script>
<style></style>
