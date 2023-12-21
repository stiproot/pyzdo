<template>
  <q-card class="card-width" :style="{ backgroundColor: item.color }">
    <q-item-section avatar v-if="item.icon">
      <q-avatar>
        <q-icon :name="item.icon" />
      </q-avatar>
    </q-item-section>
    <q-card-section v-if="item.title || item.subTitle">
      <div v-if="item.title" class="text-h6 text-content">{{ item.title }}</div>
      <div v-if="item.subTitle" class="text-subtitle2">{{ item.subTitle }}</div>
    </q-card-section>
    <q-card-section v-if="item.description">{{
      item.description
    }}</q-card-section>

    <q-separator dark />

    <q-card-actions v-if="item.actions.length">
      <q-btn
        flat
        v-for="a in item.actions"
        :key="a.evtId"
        @click="handleActionClick(a.evtId, item)"
        >{{ a.btnText }}</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "ItemComponent",
  props: { item: Object },
  setup(props, { emit }) {
    const emitEvt = (evtId, item) => {
      emit("item-click", { evtId: evtId, item: item });
    };

    const handleActionClick = (evtId, e) => {
      emitEvt(evtId, e);
    };

    return { handleActionClick };
  },
};
</script>
<style>
.card-width {
  max-width: 250px;
}

.text-content {
  white-space: normal;
  overflow: hidden;
}
</style>
