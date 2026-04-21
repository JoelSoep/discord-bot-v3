const axios = require('axios')
const present = require("present");

class StatusPage {
  constructor(apiKey, pageId) {
    this.apiKey = apiKey
    this.pageId = pageId
    this.instance = axios.create({
      baseURL: 'https://api.statuspage.io',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `OAuth ${this.apiKey}`
      }
    })
  }

  generateMetricPostPath(metricId) {
    return this.generatePagePath() + `/metrics/${metricId}/data.json`
  }

  generatePagePath() {
    return `/v1/pages/${this.pageId}`
  }

  generateRequestParameters(val) {
    return `data[timestamp]=${Math.floor(new Date() / 1000)}&data[value]=${val}`
  }

  generateComponentPath(componentId) {
    return this.generatePagePath() + `/components/${componentId}.json`
  }

  generateComponentStatusPayload(status) {
    return `component[status]=${status}`
  }

  generateCreateComponentPayload(name) {
    return `component[name]=${name}`
  }

  generateCreateIncidentNamePayload(name) {
    return `incident[name]=${name}` 
  }

  generateCreateIncidentComponentPayload(componentId, impact) {
    return `incident[components][${componentId}]=${impact}`;
  }

  generateCreateIncidentComponentIdPayload(componentId) {
    return `incident[component_ids][]=${componentId}`;
  }

  generateCreateIncidentStatusPayload(status) {
    return `incident[status]=${status}` 
  }

  generateCreateIncidentBodyPayload(body) {
    return `incident[body]=${body}` 
  }

  generateCreateIncidentImpactPayload(impact) {
    return `incident[impact_override]=${impact}`;
  }

  generateIncidentPath(incidentId) {
    return this.generatePagePath() + `/incidents/${incidentId}.json`
  }

  generateComponentsUrl() {
    return this.generatePagePath() + '/components.json'
  }

  generateIncidentsUrl() {
    return this.generatePagePath() + '/incidents.json'
  }

  generateActiveMaintenancesPath() {
    return this.generatePagePath() + '/incidents/active_maintenance'
  }

  /**
   * alternative one, do not use this to interact via default axios instance
   * @returns path for page summary
   */
  generateSummaryPath() {
    return `https://${this.pageId}.statuspage.io/api/v2/summary.json`;
  }

  updateMetric(metricId, val) {
    return this.instance.post(this.generateMetricPostPath(metricId),
                              this.generateRequestParameters(val)
    )
  }

  updateComponentState(componentId, status) {
    return this.instance.patch(
      this.generateComponentPath(componentId),
      this.generateComponentStatusPayload(status)
    )
  }

  getComponents = async () => {
    const res = await this.instance.get(
      this.generateComponentsUrl()
    )

    return res.data
  }

  createComponent(componentName) {
    return this.instance.post(
      this.generateComponentsUrl(),
      this.generateCreateComponentPayload(componentName)
    )
  }

  deleteComponent(componentId) {
    return this.instance.delete(
      this.generateComponentPath(componentId)
    )
  }

  createIncidentName(name) {
    return this.instance.post(
      this.generateIncidentsUrl(),
      this.generateCreateIncidentNamePayload(name)
    )
  }

  updateIncidentStatus(id, componentId, componentStatus, status, impact, body) {
    return this.instance.patch(
      this.generateIncidentPath(id),
      this.generateCreateIncidentStatusPayload(status) + '&' + this.generateCreateIncidentImpactPayload(impact) + '&' + this.generateCreateIncidentBodyPayload(body)
      + '&' + this.generateCreateIncidentComponentPayload(componentId, componentStatus) + '&' + this.generateCreateIncidentComponentIdPayload(componentId)
    )
  }

  updateIncidentBody(id, body) {
    return this.instance.patch(
      this.generateIncidentPath(id),
      this.generateCreateIncidentBodyPayload(body)
    )
  }

  updatePreviousIncident(id, incidentId, body) {
    return this.instance.patch(
      this.generatePreviousIncidentPath(id, incidentId),
      this.generateCreateIncidentBodyPayload(body)
    )
  }

  async createIncident(name, componentId, componentStatus, status, impact, body) {
    return this.instance.post(this.generateIncidentsUrl(),
    this.generateCreateIncidentNamePayload(name) + '&'
    + this.generateCreateIncidentComponentPayload(componentId, componentStatus) + '&'
    + this.generateCreateIncidentComponentIdPayload(componentId) + '&'
    + this.generateCreateIncidentStatusPayload(status) + '&'
    + this.generateCreateIncidentBodyPayload(body) + '&'
    + this.generateCreateIncidentImpactPayload(impact))
    }

  async deleteIncident(id) {
   return this.instance.delete(
      this.generateIncidentPath(id)
    )
  }

  async getUnresolvedIncidents() {
    const result = await this.instance.get(
      this.generatePagePath() + `/incidents/unresolved`
    )

    return result.data
  }

  async getActiveMaintenances() {
    const res = await this.instance.get(this.generateActiveMaintenancesPath());
    return res.data; 
  }

  async getSummary() {
    return await axios.get(this.generateSummaryPath());
  }

  async pingSite(host, port) {
    return await this.instance.get(`https://${host}:${port}`);
  }

  async pingDiscord() {
   return await axios.get("https://discordstatus.com/api/v2/components/rhznvxg4v7yh.json");
  }

  async pingCloudflare() {
   return await axios.get("https://www.cloudflarestatus.com/api/v2/status.json");
  }

  async pingMojang() {
    return await axios.get("https://authserver.mojang.com");
  }
}

module.exports = StatusPage
