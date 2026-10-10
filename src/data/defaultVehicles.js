export const defaultVehicles = [
  {
    id: "sedan",
    names: {
      he: "מונית רגילה",
      en: "Standard Taxi",
      ru: "Обычное такси",
      ar: "سيارة أجرة عادية",
    },
    subtitles: {},
    capacity: 4,
    image: "",
    multiplier: 1,
    visible: true,
  },
  {
    id: "mini-van",
    names: {
      he: "מיני ואן",
      en: "Mini Van",
      ru: "Мини-фургон",
      ar: "ميني فان",
    },
    subtitles: {},
    capacity: 6,
    image: "",
    multiplier: 1.25,
    visible: true,
  },
  {
    id: "van-vip",
    names: {
      he: "ואן VIP",
      en: "VIP Van",
      ru: "VIP фургон",
      ar: "فان VIP",
    },
    subtitles: {},
    capacity: 8,
    image: "",
    multiplier: 1.45,
    visible: true,
  },
  {
    id: "minibus",
    names: {
      he: "מיניבוס",
      en: "Minibus",
      ru: "Микроавтобус",
      ar: "حافلة صغيرة",
    },
    subtitles: {},
    capacity: 19,
    image: "",
    multiplier: 1.85,
    visible: true,
  },
];

export function getVehicleLabel(vehicle, lang) {
  if (!vehicle) return "";
  return vehicle.names?.[lang] || vehicle.names?.he || vehicle.id;
}

export function getVehicleSubtitle(vehicle, lang) {
  if (!vehicle?.subtitles) return "";
  return vehicle.subtitles[lang] || vehicle.subtitles.he || "";
}

export function createBlankVehicle() {
  return {
    id: `vehicle-${Date.now()}`,
    names: { he: "רכב חדש", en: "New vehicle", ru: "Новый авто", ar: "مركبة جديدة" },
    subtitles: {},
    capacity: 4,
    image: "",
    multiplier: 1,
    visible: true,
  };
}

function cloneDefaults() {
  return defaultVehicles.map((item) => ({
    ...item,
    names: { ...item.names },
    subtitles: { ...item.subtitles },
  }));
}

export function mergeVehicles(stored) {
  const defaults = cloneDefaults();
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults;
  }

  const storedById = new Map(stored.map((row) => [row.id, row]));
  const mergedDefaults = defaults.map((defaultsRow) => {
    const match = storedById.get(defaultsRow.id);
    if (!match) return defaultsRow;
    return {
      ...defaultsRow,
      ...match,
      names: { ...defaultsRow.names, ...match.names },
      subtitles: { ...defaultsRow.subtitles, ...match.subtitles },
      visible: match.visible !== false,
    };
  });

  const defaultIds = new Set(defaults.map((row) => row.id));
  const custom = stored.filter((row) => !defaultIds.has(row.id)).map((row) => ({
    ...row,
    names: { he: "רכב", en: "Vehicle", ru: "Авто", ar: "مركبة", ...row.names },
    subtitles: { ...(row.subtitles ?? {}) },
    capacity: row.capacity ?? 4,
    multiplier: row.multiplier ?? 1,
    image: row.image ?? "",
    visible: row.visible !== false,
  }));

  return [...mergedDefaults, ...custom];
}
