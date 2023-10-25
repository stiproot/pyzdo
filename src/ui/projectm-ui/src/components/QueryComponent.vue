<template>
  <div class="q-pa-md">
    <q-form class="q-gutter-md">
      <q-input
        v-model="id"
        label="Id *"
        lazy-rules
        @blur="handleIdBlur"
        :rules="[(val) => (val && val.length) || 'Id is required']"
      />
      <q-input v-model="name" label="Name" lazy-rules @blur="handleNameBlur" />
      <q-input
        v-model="ql"
        label="WIQL *"
        lazy-rules
        type="textarea"
        :rules="[(val) => (val && val.length) || 'WIQL is required']"
      />

      <BtnComponent icon="expand_more" @click="handleTestClick" />
      <FabActionComponent> </FabActionComponent>
    </q-form>
  </div>

  <div class="q-pa-md" v-if="rows && rows.length">
    <q-table title="Work Items" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="url" :props="props">
            <a :href="props.row.url" target="_blank"> {{ props.row.url }}</a>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <slot />
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import { useQueryStore, QueryProvider } from "@/stores/query.store.js";
import { getQuery, runWiql } from "@/services/azdo.service";
import FabActionComponent from "./FabActionComponent.vue";
import BtnComponent from "./BtnComponent.vue";

export default {
  name: "QueryComponent",
  components: { FabActionComponent, BtnComponent },
  setup() {
    const store = useQueryStore();
    const provider = new QueryProvider(store);

    const { id, name, ql, isValid } = provider;
    const data = reactive({ id, name, ql, isValid });

    const checkForQuery = async () => {
      if ((data.id && data.id.length) || (data.name && data.name.length)) {
        const resp = await getQuery({ id: data.id, name: data.name });
        if (resp) {
          data.id = resp.id;
          data.name = resp.name;
          data.ql = resp.wiql;
        }
      }
      return null;
    };

    const handleIdBlur = async () => {
      await checkForQuery();
    };

    const handleNameBlur = async () => {
      await checkForQuery();
    };

    const rows = ref([]);
    const handleTestClick = async () => {
      const resp = await runWiql(data.ql);
      if (resp) {
        rows.value = resp.workItems;
      }
      console.log("handleTestClick", resp);
    };

    const columns = ref([
      {
        name: "id",
        required: true,
        label: "Id",
        align: "left",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "url",
        align: "left",
        label: "Url",
        field: "url",
        sortable: false,
        format: (val) => {
          return this.$slots.linkColumn({ url: val });
        },
      },
    ]);

    return {
      ...toRefs(data),
      handleIdBlur,
      handleNameBlur,
      handleTestClick,
      columns,
      rows,
    };
  },
};
</script>
<style></style>
