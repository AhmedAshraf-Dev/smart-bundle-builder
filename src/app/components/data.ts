export type Category =
  | "CPU"
  | "Motherboard"
  | "RAM"
  | "GPU"
  | "Storage"
  | "Power Supply"
  | "Case";

export interface PCComponent {
  id: string;
  name: string;
  category: Category;
  price: number;
  compatibility?: string[];
  compatibleWith?: Record<string, string[]>;
  description: string;
}

export const BUDGET_MAX = 1000;

export const CATEGORIES: Category[] = [
  "CPU",
  "Motherboard",
  "RAM",
  "GPU",
  "Storage",
  "Power Supply",
  "Case",
];

export const COMPONENTS: PCComponent[] = [
  {
    id: "cpu-intel-i5",
    name: "Intel Core i5-13600K",
    category: "CPU",
    price: 250,
    description: "13th Gen, 14 cores, 5.1GHz boost",
    compatibleWith: { Motherboard: ["mb-intel-z790", "mb-intel-b660"] },
  },
  {
    id: "cpu-amd-ryzen5",
    name: "AMD Ryzen 5 7600X",
    category: "CPU",
    price: 220,
    description: "Zen 4 architecture, 6 cores, 5.3GHz boost",
    compatibleWith: { Motherboard: ["mb-amd-x670", "mb-amd-b650"] },
  },
  {
    id: "mb-intel-z790",
    name: "Intel Z790 AORUS Elite",
    category: "Motherboard",
    price: 150,
    description: "ATX, DDR5, PCIe 5.0, Intel LGA1700",
    compatibleWith: { CPU: ["cpu-intel-i5"] },
  },
  {
    id: "mb-amd-x670",
    name: "AMD X670E AORUS Master",
    category: "Motherboard",
    price: 140,
    description: "ATX, DDR5, PCIe 5.0, AMD AM5",
    compatibleWith: { CPU: ["cpu-amd-ryzen5"] },
  },
  {
    id: "ram-16gb-ddr4",
    name: "16GB DDR4-3600 RAM",
    category: "RAM",
    price: 80,
    description: "2×8GB, CL16, 3600MHz",
  },
  {
    id: "gpu-rtx4060",
    name: "NVIDIA GeForce RTX 4060",
    category: "GPU",
    price: 350,
    description: "8GB GDDR6, DLSS 3, ray tracing",
  },
  {
    id: "storage-1tb-ssd",
    name: "Samsung 970 EVO 1TB SSD",
    category: "Storage",
    price: 90,
    description: "NVMe PCIe 3.0, 3500MB/s read",
  },
  {
    id: "psu-650w",
    name: "Corsair RM650x Gold PSU",
    category: "Power Supply",
    price: 100,
    description: "650W, 80+ Gold, fully modular",
  },
  {
    id: "case-mid-tower",
    name: "NZXT H510 Mid Tower",
    category: "Case",
    price: 70,
    description: "ATX, tempered glass, cable management",
  },
];

export function getComponentsByCategory(category: Category): PCComponent[] {
  return COMPONENTS.filter((c) => c.category === category);
}

export function isCompatible(
  component: PCComponent,
  selected: Record<string, string>
): boolean {
  if (!component.compatibleWith) return true;
  for (const [cat, ids] of Object.entries(component.compatibleWith)) {
    const selectedId = selected[cat];
    if (selectedId && !ids.includes(selectedId)) {
      return false;
    }
  }
  return true;
}

export function wouldBeIncompatible(
  component: PCComponent,
  selected: Record<string, string>
): boolean {
  // Check if any currently selected component is incompatible WITH this component
  for (const [catId, selectedComponentId] of Object.entries(selected)) {
    const selectedComp = COMPONENTS.find((c) => c.id === selectedComponentId);
    if (!selectedComp?.compatibleWith) continue;
    const rules = selectedComp.compatibleWith[component.category];
    if (rules && !rules.includes(component.id)) {
      return true;
    }
  }
  return !isCompatible(component, selected);
}
