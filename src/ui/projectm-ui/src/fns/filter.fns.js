import { deepFilter } from "./data.fns.js";

export const buildTagFilterPredicate = (tag) => (n) =>
  (n.tags || []).filter((t) => t === tag).length > 0;

export const buildSeverityFilterPredicate = (severities) => (n) =>
  severities.includes(n.severity);

export const buildRiskWeightPredicate = (riskWeight) => (n) =>
  n.risk_weight >= riskWeight;

export const filterByTag = (data, tag) => {
  const filtered = [];
  deepFilter(data, [buildTagFilterPredicate(tag)], filtered);

  return filtered;
};

export const filterByRiskWeight = (data, range) => {
  const filtered = [];
  deepFilter(data, [buildRiskWeightPredicate(range)], filtered);

  return filtered;
};
