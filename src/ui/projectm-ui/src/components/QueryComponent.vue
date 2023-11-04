<template>
  <q-dialog v-model="searching">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Search</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <InfiniteScrollComponent
          @selected="handleQuerySelect"
          default=""
          v-model="model"
          label="Name"
          optionValue="id"
          optionLabel="name"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <div class="q-pa-md">
    <q-form class="q-gutter-md">
      <q-input
        v-model="name"
        label="Name *"
        lazy-rules
        :rules="[(val) => (val && val.length) || 'Name is required']"
      >
        <template v-slot:after>
          <q-btn
            round
            color="primary"
            icon="search"
            @click="searching = true"
          />
        </template>
      </q-input>
      <q-input
        v-model="ql"
        label="WIQL *"
        lazy-rules
        type="textarea"
        :rules="[(val) => (val && val.length) || 'WIQL is required']"
      />

      <q-input
        v-model="tags"
        label="Tags (semi-colon separated)"
        lazy-rules
        @blur="handleTagsBlur"
      />

      <BtnComponent icon="expand_more" @click="handleTestClick" />
    </q-form>
  </div>

  <div class="q-pa-md">
    <div v-if="rows && rows.length === 0">
      <div>Nothing found.</div>
    </div>

    <div v-if="rows && rows.length">
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
  </div>

  <slot />
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import { useQueryStore, QueryProvider } from "@/stores/query.store.js";
import { runWiql } from "@/services/azdo.service";
import BtnComponent from "./BtnComponent.vue";
import InfiniteScrollComponent from "./InfiniteScrollComponent.vue";

export default {
  name: "QueryComponent",
  components: { BtnComponent, InfiniteScrollComponent },
  setup() {
    const store = useQueryStore();
    const provider = new QueryProvider(store);

    const rows = ref(null);
    const tags = ref(null);
    const { name, ql, isValid } = provider;
    const searching = ref(false);
    const data = reactive({ name, ql, isValid, tags, searching });

    const clearTags = () => {
      tags.value = "";
    };

    const handleTagsBlur = async () => {
      if (!tags.value || !tags.value.length) {
        return;
      }

      const tagsArr = tags.value.split(";");

      if (!tagsArr.includes("ProjectMetrics")) {
        tagsArr.push("ProjectMetrics");
      }

      const tagFilter = tagsArr
        .map((t) => `[System.Tags] CONTAINS '${t}'`)
        .join(" AND ");

      const wiql =
        `SELECT ` +
        `[System.Id], ` +
        `[System.WorkItemType], ` +
        `[System.Title], ` +
        `[System.AssignedTo], ` +
        `[System.State], ` +
        `[System.Tags]  ` +
        `FROM WorkItems WHERE ${tagFilter}`;

      ql.value = wiql;
      name.value = tagsArr.join("_");
    };

    const handleTestClick = async () => {
      const resp = await runWiql(data.ql);
      if (resp) {
        rows.value = resp.workItems;
      } else {
        rows.value = [];
      }
    };

    const handleQuerySelect = (item) => {
      if (!item || item === "") {
        return;
      }
      name.value = item.name;
      ql.value = item.wiql;
      searching.value = false;
      clearTags();
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
      handleTagsBlur,
      handleTestClick,
      handleQuerySelect,
      clearTags,
      columns,
      rows,
    };
  },
};
</script>
<style></style>
