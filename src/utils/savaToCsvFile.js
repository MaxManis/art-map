import { stringify } from "csv-stringify/browser/esm/sync";

export const saveToCsvFile = (data) => {
  const csvData = mapReportsDataToCsvData(data);
  const csv = stringify(csvData);
  const blob = new Blob([csv], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `reports-${new Date().toLocaleDateString()}-${data.length}.csv`;
  link.href = url;
  link.click();
};

const mapReportsDataToCsvData = (data) => {
  const headers = [
    "Вид озброєння",
    "Вихід MGRS",
    "Прихід MGRS",
    "Дистанція (мерти)",
    "Коментар",
    "Дата/Час",
    "Звіт",
    "Позивний",
    "Вихід широта",
    "Вихід довгота",
    "Прихід широта",
    "Прихід довгота",
    "Усього точок",
  ];
  const csvData = [headers];

  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    const currData = [
      el.type || "",
      el.fromMgrs || "",
      el.toMgrs || "",
      el.distance || "",
      el.comment || "",
      el.dateString || "",
      el.rawReport || "",
      el.actor || "",
      el.fromLat || "",
      el.fromLng || "",
      el.toLat || "",
      el.toLng || "",
      el.pointsCount || "",
    ];

    csvData.push(currData);
  }

  return csvData;
};
