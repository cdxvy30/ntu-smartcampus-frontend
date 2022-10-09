export const colors = {
  default: "#1f8ef1",
  blue: "#0000ff",
  brown: "#a52a2a",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgrey: "#5c5c5c",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkviolet: "#9400d3",
  green: "#008000",
  indigo: "#4b0082",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  orange: "#ffa500",
  purple: "#800080",
  violet: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  black: "#000000",
};

export const pickColor = (index) => {
  const keys = Object.keys(colors);
  const key = keys[index % keys.length];
  return colors[key];
};
