<template>
  <div class="qa-pa-md row items-start q-gutter-md">
    <ItemComponent
      v-for="i in items"
      :key="i.id"
      :item="i"
      @item-click="onItemClick"
    />
  </div>
</template>

<script>
import ItemComponent from "./ItemComponent.vue";
export default {
  name: "ItemSelectorComponent",
  components: { ItemComponent },
  props: { items: Array },
  setup(props, { emit }) {
    const emitEvent = (e) => {
      emit(e.evtId, e.itemId);
    };

    const onItemClick = (e) => {
      emitEvent(e);
    };

    return { onItemClick };
  },
};
</script>
<style></style>
