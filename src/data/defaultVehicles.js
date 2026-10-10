export const defaultVehicles = [
  {
    id: "sedan",
    names: {
      he: "מונית רגילה",
      en: "Standard Taxi",
      ru: "Обычное такси",
      ar: "سيارة أجرة عادية",
    },
    capacity: 4,
    image: "",
    multiplier: 1,
  },
  {
    id: "mini-van",
    names: {
      he: "מיני ואן",
      en: "Mini Van",
      ru: "Мини-фургон",
      ar: "ميني فان",
    },
    capacity: 6,
    image: "",
    multiplier: 1.25,
  },
  {
    id: "van-vip",
    names: {
      he: "ואן VIP",
      en: "VIP Van",
      ru: "VIP фургон",
      ar: "فان VIP",
    },
    capacity: 8,
    image: "",
    multiplier: 1.45,
  },
  {
    id: "minibus",
    names: {
      he: "מיניבוס",
      en: "Minibus",
      ru: "Микроавтобус",
      ar: "حافلة صغيرة",
    },
    capacity: 19,
    image: "",
    multiplier: 1.85,
  },
];

export function getVehicleLabel(vehicle, lang) {
  if (!vehicle) return "";
  return vehicle.names?.[lang] || vehicle.names?.he || vehicle.id;
}

export function mergeVehicles(stored) {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaultVehicles.map((item) => ({ ...item, names: { ...item.names } }));
  }
  return defaultVehicles.map((defaults) => {
    const match = stored.find((row) => row.id === defaults.id);
    if (!match) return { ...defaults, names: { ...defaults.names } };
    return {
      ...defaults,
      ...match,
      names: { ...defaults.names, ...match.names },
    };
  });
}
