function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function downloadRidesCsv(rides, filename = "david-taxi-rides.csv") {
  const headers = [
    "id",
    "createdAt",
    "source",
    "clientName",
    "phone",
    "origin",
    "destination",
    "dateTime",
    "vehicleType",
    "agreedPrice",
    "status",
    "commissionPercent",
  ];

  const rows = rides.map((ride) =>
    headers.map((key) => escapeCsv(ride[key])).join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
