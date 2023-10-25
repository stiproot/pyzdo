<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />
        <q-toolbar-title> project_m(andy) </q-toolbar-title>
        <div>v0.0.1-beta</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <q-list>
        <q-item-label header>menu</q-item-label>

        <q-item clickable tag="a" to="/projects" exact>
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Projects</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" to="/azdo/wis" exact>
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>AzDO</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://github.com/Simon-Stipcich_derivco/project-m"
        >
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>GitHub</q-item-label>
            <q-item-label caption>github.com/project-m</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" target="_blank" href="https://d3js.org/">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>d3.js</q-item-label>
            <q-item-label caption>d3.org</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
      <LoadingComponent />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import LoadingComponent from "@/components/LoadingComponent.vue";

export default {
  name: "LayoutDefault",
  components: {
    LoadingComponent,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    return {
      leftDrawerOpen,
    };
  },
};
</script>
