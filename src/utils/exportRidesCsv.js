import { computeCommissionAmount, computeNetProfit } from "../store/rides";

function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function downloadRidesCsv(rides, filename = "david-taxi-rides.csv") {
  const headers = [
    "orderId",
    "orderNumber",
    "id",
    "createdAt",
    "source",
    "clientName",
    "phone",
    "cityRegion",
    "origin",
    "pickup",
    "destination",
    "dateTime",
    "vehicleType",
    "passengersCount",
    "luggageDetails",
    "flightNumber",
    "basePrice",
    "paymentMethod",
    "commissionType",
    "commissionPercent",
    "commissionFixed",
    "commissionAmount",
    "netProfit",
    "assignedDriverName",
    "status",
    "commissionPaid",
    "commissionPaidAt",
  ];

  const rows = rides.map((ride) => {
    const row = {
      ...ride,
      commissionAmount: Math.round(computeCommissionAmount(ride)),
      netProfit: Math.round(computeNetProfit(ride)),
    };
    return headers.map((key) => escapeCsv(row[key])).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
