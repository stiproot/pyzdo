export function kebabToUpperCaseSnake(str) {
  return str.replace(/-/g, "_").toUpperCase();
}
