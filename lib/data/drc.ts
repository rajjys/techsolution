/**
 * Géographie RDC pour la carte de couverture (matrice de points).
 * Contour simplifié du pays (longitude, latitude) — usage illustratif.
 */
export type LonLat = [number, number];

export const DRC_BOUNDS = {
  west: 12.0,
  east: 31.5,
  south: -13.6,
  north: 5.5,
} as const;

export const DRC_OUTLINE: LonLat[] = [
  [12.2, -5.98],
  [12.6, -5.73],
  [12.9, -5.03],
  [13.1, -4.68],
  [13.7, -4.5],
  [14.5, -4.3],
  [15.3, -4.3],
  [15.9, -3.7],
  [16.2, -3.0],
  [16.2, -2.2],
  [16.6, -1.2],
  [17.1, -0.6],
  [17.6, -0.1],
  [17.85, 0.6],
  [18.1, 1.6],
  [18.1, 2.6],
  [18.55, 3.3],
  [18.6, 4.2],
  [19.4, 4.9],
  [20.5, 4.5],
  [21.6, 4.3],
  [22.5, 4.2],
  [23.3, 4.6],
  [24.3, 5.0],
  [25.3, 5.3],
  [26.1, 5.25],
  [27.1, 5.2],
  [27.45, 5.0],
  [27.8, 4.5],
  [28.4, 4.35],
  [29.2, 4.6],
  [29.9, 4.4],
  [30.55, 3.85],
  [30.86, 3.42],
  [30.94, 2.4],
  [31.3, 2.12],
  [30.9, 1.3],
  [30.48, 0.85],
  [29.95, 0.5],
  [29.62, -0.45],
  [29.58, -1.4],
  [29.25, -1.65],
  [29.1, -2.3],
  [29.22, -2.85],
  [29.22, -3.3],
  [29.4, -4.5],
  [29.6, -5.5],
  [29.5, -6.3],
  [29.7, -7.0],
  [30.3, -7.3],
  [30.75, -8.2],
  [30.0, -8.5],
  [28.95, -8.45],
  [28.4, -9.2],
  [28.65, -10.6],
  [28.55, -11.9],
  [29.0, -12.4],
  [29.5, -12.25],
  [29.8, -12.55],
  [29.78, -13.45],
  [29.0, -13.4],
  [28.4, -12.85],
  [27.6, -12.3],
  [27.0, -11.6],
  [26.0, -11.9],
  [25.3, -11.25],
  [24.4, -11.4],
  [23.95, -10.95],
  [22.2, -11.05],
  [22.2, -10.0],
  [21.85, -9.4],
  [21.8, -8.0],
  [21.75, -7.3],
  [20.55, -7.28],
  [20.6, -6.95],
  [19.55, -7.0],
  [19.35, -7.95],
  [17.6, -8.1],
  [16.95, -7.2],
  [16.6, -6.05],
  [16.0, -5.87],
  [14.4, -5.88],
  [13.2, -5.86],
];

export type MapCity = {
  name: string;
  lon: number;
  lat: number;
  /** Site avec réalisations Tech Solution documentées */
  active: boolean;
  labelAnchor: "start" | "end";
  labelDx: number;
  labelDy: number;
};

/** Villes : sites d'intervention réels (active) + repères géographiques. */
export const mapCities: MapCity[] = [
  { name: "Mahagi", lon: 30.98, lat: 2.3, active: true, labelAnchor: "end", labelDx: -10, labelDy: -4 },
  { name: "Bunia", lon: 30.25, lat: 1.56, active: true, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  { name: "Aveba", lon: 30.05, lat: 1.05, active: true, labelAnchor: "end", labelDx: -10, labelDy: 14 },
  { name: "Butembo", lon: 29.28, lat: 0.14, active: true, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  { name: "Goma", lon: 29.22, lat: -1.68, active: true, labelAnchor: "end", labelDx: -10, labelDy: 0 },
  { name: "Numbi", lon: 28.85, lat: -2.08, active: true, labelAnchor: "end", labelDx: -10, labelDy: 14 },
  { name: "Kinshasa", lon: 15.31, lat: -4.32, active: false, labelAnchor: "start", labelDx: 10, labelDy: -6 },
  { name: "Kisangani", lon: 25.19, lat: 0.52, active: false, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  { name: "Lubumbashi", lon: 27.48, lat: -11.66, active: false, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  { name: "Kolwezi", lon: 25.47, lat: -10.72, active: false, labelAnchor: "end", labelDx: -10, labelDy: -2 },
  { name: "Matadi", lon: 13.45, lat: -5.82, active: false, labelAnchor: "start", labelDx: 8, labelDy: 12 },
];

export type Province = {
  name: string;
  /** Province avec réalisations livrées */
  active: boolean;
};

/** Les 26 provinces de la RDC — zone d'intervention nationale. */
export const provinces: Province[] = [
  { name: "Bas-Uele", active: false },
  { name: "Équateur", active: false },
  { name: "Haut-Katanga", active: false },
  { name: "Haut-Lomami", active: false },
  { name: "Haut-Uele", active: false },
  { name: "Ituri", active: true },
  { name: "Kasaï", active: false },
  { name: "Kasaï-Central", active: false },
  { name: "Kasaï-Oriental", active: false },
  { name: "Kinshasa", active: false },
  { name: "Kongo-Central", active: false },
  { name: "Kwango", active: false },
  { name: "Kwilu", active: false },
  { name: "Lomami", active: false },
  { name: "Lualaba", active: false },
  { name: "Mai-Ndombe", active: false },
  { name: "Maniema", active: false },
  { name: "Mongala", active: false },
  { name: "Nord-Kivu", active: true },
  { name: "Nord-Ubangi", active: false },
  { name: "Sankuru", active: false },
  { name: "Sud-Kivu", active: true },
  { name: "Sud-Ubangi", active: false },
  { name: "Tanganyika", active: false },
  { name: "Tshopo", active: false },
  { name: "Tshuapa", active: false },
];
