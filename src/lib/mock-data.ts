
export const mockPharmacies = [
  {
    id: "gupta-medical-hall",
    name: "Gupta Medical Hall",
    address: "Shop No. 12, Sadar Bazar, Near Civil Hospital, Nabha, Punjab 147201",
    hours: "9:00 AM - 9:00 PM",
    phone: "(555) 111-2222",
    services: ["Delivery"],
  },
  {
    id: "aggarwal-medicos",
    name: "Aggarwal Medicos",
    address: "Patiala Gate, Opposite Nabha Medical College, Nabha, Punjab 147201",
    hours: "8:30 AM - 10:00 PM",
    phone: "(555) 333-4444",
    services: ["24/7"],
  },
  {
    id: "jindal-medical-store",
    name: "Jindal Medical Store",
    address: "Circular Road, Near Fountain Chowk, Nabha, Punjab 147201",
    hours: "10:00 AM - 8:00 PM",
    phone: "(555) 555-6666",
    services: [],
  },
  {
    id: "sharma-pharmacy",
    name: "Sharma Pharmacy",
    address: "Near Old Bus Stand, A.C. Market, Nabha, Punjab 147201",
    hours: "9:00 AM - 8:30 PM",
    phone: "(555) 777-8888",
    services: ["Delivery"],
  },
  {
    id: "singla-health-care",
    name: "Singla Health Care",
    address: "Bhavanigarh Road, Model Town, Nabha, Punjab 147201",
    hours: "8:00 AM - 11:00 PM",
    phone: "(555) 999-0000",
    services: ["24/7", "Delivery"],
  },
];

export const mockMedicineStock: { [key: string]: { name: string; stock: string; type: string }[] } = {
  "gupta-medical-hall": [
    { name: "Paracetamol 500mg", stock: "In Stock", type: "Tablet" },
    { name: "Benadryl Cough Syrup", stock: "In Stock", type: "Syrup" },
    { name: "Aspirin 75mg", stock: "Low Stock", type: "Tablet" },
    { name: "Digene Antacid", stock: "Out of Stock", type: "Liquid" },
    { name: "Crocin Advance", stock: "In Stock", type: "Tablet" },
  ],
  "aggarwal-medicos": [
    { name: "Ibuprofen 400mg", stock: "In Stock", type: "Tablet" },
    { name: "Hansaplast Band-Aids", stock: "In Stock", type: "Medical Supply" },
    { name: "Becosules Vitamins", stock: "In Stock", type: "Capsule" },
    { name: "Volini Pain Relief Spray", stock: "In Stock", type: "Spray" },
  ],
  "jindal-medical-store": [
    { name: "Paracetamol 650mg", stock: "In Stock", type: "Tablet" },
    { name: "Cetirizine 10mg", stock: "Out of Stock", type: "Tablet" },
    { name: "Odomos Mosquito Repellent", stock: "In Stock", type: "Cream" },
  ],
  "sharma-pharmacy": [
    { name: "Honitus Cough Syrup", stock: "In Stock", type: "Syrup" },
    { name: "Moov Pain Relief Balm", stock: "Low Stock", type: "Ointment" },
    { name: "Dettol Antiseptic Liquid", stock: "In Stock", type: "Liquid" },
  ],
  "singla-health-care": [
    { name: "Calpol 500mg", stock: "In Stock", type: "Tablet" },
    { name: "Brufen 400mg", stock: "In Stock", type: "Tablet" },
    { name: "Grilinctus Cough Syrup", stock: "In Stock", type: "Syrup" },
    { name: "Eno Antacid", stock: "In Stock", type: "Sachet" },
  ],
};
