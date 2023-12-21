export function genRndHex(n) {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < n; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function genRndColorHash(keys) {
  const n = keys.length;
  let hash = {};

  for (let i = 0; i < n; i++) {
    const color = genRndHex(6);
    hash[keys[i]] = color;
  }

  return hash;
}

export const getBadgeColor = (riskImpact) => {
  if (riskImpact >= 40) return "red";
  else if (riskImpact >= 15) return "orange";
  else return "green";
};

export const getRiskText = (riskImpact) => {
  if (riskImpact >= 40) return "High Risk";
  else if (riskImpact >= 15) return "Medium Risk";
  else return "Low Risk";
};

export const getRagColorHex = (ragStatus) => {
  if (ragStatus === "Red") return "#DA3637";
  if (ragStatus === "Amber") return "#FFC107";
  return "#77DD77";
};
