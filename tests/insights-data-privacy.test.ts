import { describe, expect, it } from "vitest";
import data from "../src/content/insights/demo-data.json";
import { readdirSync } from "node:fs";

describe("published Insights demo data", () => {
  it("contains only approved analytical columns, never vehicle identifiers", () => {
    const columns = ["area", "areaLabel", "date", "hour", "dwellMin", "zip", "zipGroup", "fuel", "vehicleType", "usage", "manufacturer"].sort();
    expect(Object.keys(data).sort()).toEqual(["areas", "dates", "rows"]);
    for (const row of data.rows) expect(Object.keys(row).sort()).toEqual(columns);
  });
  it("uses anonymous zone names consistently", () => {
    expect(data.areas.map(area => area.label)).toEqual(["Parking zone 1", "Parking zone 2", "Parking zone 3"]);
    for (const row of data.rows) expect(data.areas.find(area => area.area === row.area)?.label).toBe(row.areaLabel);
  });
  it("does not publish raw CSV files", () => {
    expect(readdirSync("public", { recursive: true }).filter(path => /\.csv$/i.test(String(path)))).toEqual([]);
  });
});
