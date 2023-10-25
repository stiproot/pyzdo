function genRndHex(n) {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < n; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function genRndColorHash(keys) {
  const n = keys.length;
  let hash = {};

  for (let i = 0; i < n; i++) {
    const color = genRndHex(6);
    hash[keys[i]] = color;
  }

  return hash;
}

export { genRndHex, genRndColorHash };
