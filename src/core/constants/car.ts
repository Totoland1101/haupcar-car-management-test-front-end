import type { CarStatus, FuelType } from "../services/car";

export const CAR_STATUS: Record<CarStatus, { label: string; color: string }> = {
  available: { label: "Available", color: "green" },
  in_use: { label: "In use", color: "blue" },
  maintenance: { label: "Maintenance", color: "orange" },
  inactive: { label: "Inactive", color: "default" },
};

export const FUEL_TYPES: Record<FuelType, string> = {
  gasoline: "Gasoline",
  diesel: "Diesel",
  hybrid: "Hybrid",
  plug_in_hybrid: "Plug-in hybrid",
  electric: "Electric",
  lpg: "LPG",
  ngv: "NGV",
};

export const FUEL_OPTIONS = (Object.keys(FUEL_TYPES) as FuelType[]).map((value) => ({
  value,
  label: FUEL_TYPES[value],
}));

export const STATUS_OPTIONS = (Object.keys(CAR_STATUS) as CarStatus[]).map((value) => ({
  value,
  label: CAR_STATUS[value].label,
}));

// Models sold in Thailand, offered once a brand is picked. People can still type one that
// isn't listed.
export const CAR_MODELS: Record<string, string[]> = {
  BMW: ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "i4", "iX", "iX3"],
  BYD: ["Atto 3", "Dolphin", "M6", "Seal", "Sealion 6", "Sealion 7"],
  Chevrolet: ["Captiva", "Colorado", "Trailblazer"],
  Ford: ["Everest", "Mustang", "Ranger", "Ranger Raptor"],
  GWM: ["Haval H6", "Haval Jolion", "Ora Good Cat", "Tank 300", "Tank 500"],
  Honda: ["Accord", "BR-V", "City", "Civic", "CR-V", "e:N1", "HR-V", "WR-V"],
  Hyundai: ["Creta", "H-1", "Ioniq 5", "Ioniq 6", "Staria", "Tucson"],
  Isuzu: ["D-Max", "MU-X"],
  Kia: ["Carnival", "EV5", "EV6", "EV9", "Sonet", "Sportage"],
  Lexus: ["ES", "IS", "LM", "NX", "RX", "RZ", "UX"],
  Mazda: ["2", "3", "BT-50", "CX-3", "CX-30", "CX-5", "CX-8", "CX-60"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "EQA", "EQB", "EQE", "EQS"],
  MG: ["MG3", "MG4", "MG5", "Cyberster", "Extender", "HS", "Maxus 9", "ZS", "ZS EV"],
  Mitsubishi: ["Attrage", "Mirage", "Outlander PHEV", "Pajero Sport", "Triton", "Xpander", "Xpander Cross"],
  Neta: ["V", "V-II", "X"],
  Nissan: ["Almera", "Kicks", "Leaf", "Navara", "Note", "Serena", "Terra"],
  Subaru: ["Crosstrek", "Forester", "XV"],
  Suzuki: ["Celerio", "Ciaz", "Ertiga", "Jimny", "Swift", "XL7"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
  Toyota: [
    "Alphard", "bZ4X", "Camry", "Commuter", "Corolla Altis", "Corolla Cross", "Fortuner", "Hiace",
    "Hilux Champ", "Hilux Revo", "Innova Zenix", "Veloz", "Vios", "Yaris", "Yaris Ativ", "Yaris Cross",
  ],
  Volvo: ["C40", "EX30", "S60", "S90", "XC40", "XC60", "XC90"],
};

export const COMMON_BRANDS = Object.keys(CAR_MODELS);

// The models for a brand, matched without caring about letter case. Empty for a brand
// that isn't in the list.
export function modelsForBrand(brand: string | undefined): string[] {
  const key = Object.keys(CAR_MODELS).find((name) => name.toLowerCase() === brand?.trim().toLowerCase());
  return key ? CAR_MODELS[key] : [];
}

// All 77 Thai provinces, in Thai alphabetical order.
export const PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี",
  "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด",
  "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี",
  "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี",
  "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์",
  "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง",
  "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล",
  "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย",
  "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ",
  "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี",
];
