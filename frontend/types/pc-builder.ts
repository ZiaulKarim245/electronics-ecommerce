export type ComponentCategory =
  | "Processor"
  | "CPU Cooler"
  | "Motherboard"
  | "RAM"
  | "Storage"
  | "Graphics Card"
  | "Power Supply"
  | "Casing"
  | "Monitor"
  | "Casing Cooler"
  | "Keyboard"
  | "Mouse"
  | "Headphone"
  | "Anti Virus"
  | "UPS";

export type ComponentVisualType =
  | "cpu"
  | "cooler"
  | "motherboard"
  | "ram"
  | "storage"
  | "gpu"
  | "psu"
  | "casing"
  | "monitor"
  | "accessories"
  | "security";

export interface PCComponent {
  id: string;
  category: ComponentCategory;
  name: string;
  brand: string;
  price: number;
  icon: string;
  visualType: ComponentVisualType;
  /**
   * For all components: estimated power CONSUMPTION in watts (what it draws from PSU).
   * For Power Supply units: idle/self-consumption (~10W). Use `psuCapacity` for rated output.
   */
  wattage: number;
  /**
   * PSU only: rated power OUTPUT in watts (e.g. 850 for an 850W PSU).
   * Used to validate whether the PSU can supply enough power for the build.
   */
  psuCapacity?: number;
  socket?: string;
  ramType?: "DDR4" | "DDR5";
  specs: string[];
}

export interface PCBuilderSlot {
  category: ComponentCategory;
  label: string;
  visualType: ComponentVisualType;
  required: boolean;
}
