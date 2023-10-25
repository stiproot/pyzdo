import { createRouter, createWebHistory } from "vue-router";
import ProjectManagerComponent from "../components/ProjectManagerComponent.vue";
import ProjectRootComponent from "../components/ProjectRootComponent.vue";

const routes = [
  {
    path: "/",
    name: "projects",
    component: ProjectManagerComponent,
  },
  {
    path: "/projects",
    name: "projects",
    component: ProjectManagerComponent,
  },
  {
    path: "/projects/new",
    name: "definition",
    component: () => import("../components/ProjectDefinitionComponent.vue"),
    props: (route) => ({ tabId: route.query["tab"] }),
  },
  {
    path: "/projects/:projectId",
    name: "project",
    component: ProjectRootComponent,
    props: (route) => ({ tabId: route.query["tab"] }),
    children: [
      {
        path: "vis",
        name: "project.vis",
        component: () => import("../components/VisManagerComponent.vue"),
        props: (route) => ({ tabId: route.query["tab"] }),
        children: [
          {
            path: "chart/:chartId",
            name: "vis.chart",
            component: () => import("../components/ChartComponent.vue"),
          },
        ],
      },
      {
        path: "definition",
        name: "project.definition",
        component: () => import("../components/ProjectDefinitionComponent.vue"),
        props: (route) => ({ tabId: route.query["tab"] }),
      },
    ],
  },
  {
    path: "/azdo",
    name: "azdo",
    component: () => import("../components/AzdoManagerComponent.vue"),
    children: [
      {
        path: "wis",
        name: "azdo.wis",
        component: () => import("../components/AzdoWiManagerComponent.vue"),
        props: (route) => ({ tabId: route.query["tab"] }),
      },
      {
        path: "dashboards",
        name: "azdo.dashboards",
        component: () =>
          import("../components/CreateAzdoDashboardComponent.vue"),
      },
    ],
  },
  // {
  //   path: "/filters",
  //   name: "filters",
  //   component: FilterControlsComponent,
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
