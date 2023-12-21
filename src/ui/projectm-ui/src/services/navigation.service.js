export class NavigationService {
  constructor(router) {
    this._router = router;
    this.goToProject = this.goToProject.bind(this);
  }

  isNewProject = () =>
    this._router.currentRoute.value.path.includes("projects/new");

  projectDimension() {
    const last = this._router.currentRoute.value.path.split("/").pop();
    return last;
  }

  azdoDims() {
    const last = this._router.currentRoute.value.path.split("/").pop();
    return last;
  }

  goToProjects() {
    this._router.push({ name: "projects" });
  }

  goToProject(id) {
    this._router.push({
      name: "project",
      params: { projectId: id },
      query: { tab: "queries" },
    });
  }

  newProject() {
    this._router.push({
      name: "definition",
      params: { projectId: "new" },
      query: { tab: "queries" },
    });
  }

  goToProjectDefinition(id) {
    this._router.push({
      name: "project.definition",
      params: { projectId: id },
      query: { tab: "queries" },
    });
  }

  goToVis(projId) {
    this._router.push({
      name: "project.vis",
      params: { projectId: projId },
      query: { tab: "charts" },
    });
  }

  goToWis() {
    this._router.push({
      name: "azdo.wis",
      query: { tab: "clone" },
    });
  }

  goToDashboards() {
    this._router.push({
      name: "azdo.dashboards",
    });
  }

  goToChart(projId, chartId) {
    this._router.push({
      name: "vis.chart",
      params: { projectId: projId, chartId: chartId },
    });
  }

  getRouteParam(param) {
    return this._router.currentRoute.value.params[param];
  }

  get projId() {
    return this.getRouteParam("projectId");
  }

  get chartId() {
    return this.getRouteParam("chartId");
  }

  get isNew() {
    return this._router.currentRoute.value.path.includes("new");
  }
}
