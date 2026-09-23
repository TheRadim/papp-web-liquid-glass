// Illustrative values for the homepage preview; not live measurements or client results.
export const originDemo = [
  { country: "Denmark", da: "Danmark", share: 72 },
  { country: "Sweden", da: "Sverige", share: 12 },
  { country: "Germany", da: "Tyskland", share: 8 },
  { country: "Norway", da: "Norge", share: 5 },
  { country: "Finland", da: "Finland", share: 3 }
];
export const manufacturerDemo = [
  { name: "Volkswagen", share: 24 }, { name: "Toyota", share: 18 },
  { name: "Tesla", share: 16 }, { name: "Ford", share: 14 },
  { name: "Škoda", share: 12 }, { name: "Peugeot", share: 9 },
  { name: "Kia", share: 7 }
];
export const activityDemo = Array.from({ length: 216 }, (_, index) => {
  const hour = index % 24;
  const day = Math.floor(index / 24);
  const daytime = hour >= 7 && hour <= 19;
  return daytime ? Math.round(12 + Math.sin((hour - 7) / 12 * Math.PI) * (28 + day % 3 * 4) + Math.sin(index * 2.4) * 5) : 3 + day % 4;
});
