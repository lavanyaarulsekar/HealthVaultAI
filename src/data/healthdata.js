export const medicalRecords = [
  {
    id: 1,
    name: "Complete Blood Count",
    description: "Laboratory Report",
    category: "Lab Report",
    date: "10 Aug 2026",
  },
  {
    id: 2,
    name: "Prescription",
    description: "General Medicine",
    category: "Prescription",
    date: "05 Aug 2026",
  },
  {
    id: 3,
    name: "Chest X-Ray",
    description: "Imaging Report",
    category: "Imaging",
    date: "28 Jul 2026",
  },
  {
    id: 4,
    name: "Annual Health Checkup",
    description: "General Health Report",
    category: "Health Report",
    date: "18 Jul 2026",
  },
];

export const appointments = [
  {
    id: 1,
    date: "14 Aug 2026",
    time: "10:30 AM",
    title: "General Checkup",
    doctor: "Dr. Sarah",
    location: "City Hospital",
    type: "Consultation",
    status: "Upcoming",
  },
  {
    id: 2,
    date: "21 Aug 2026",
    time: "09:00 AM",
    title: "Blood Test",
    doctor: "Dr. Michael",
    location: "City Hospital",
    type: "Lab Test",
    status: "Upcoming",
  },
  {
    id: 3,
    date: "05 Jul 2026",
    time: "11:00 AM",
    title: "Dental Checkup",
    doctor: "Dr. Priya",
    location: "Smile Care Clinic",
    type: "Dental",
    status: "Completed",
  },
];

export const medicines = [
  {
    id: 1,
    name: "Vitamin D3",
    dosage: "1000 IU",
    frequency: "Once daily",
    time: "08:00 AM",
    period: "Morning",
    status: "Taken",
  },
  {
    id: 2,
    name: "Medicine A",
    dosage: "500 mg",
    frequency: "Twice daily",
    time: "01:00 PM",
    period: "Afternoon",
    status: "Pending",
  },
  {
    id: 3,
    name: "Medicine B",
    dosage: "10 mg",
    frequency: "Once daily",
    time: "08:00 PM",
    period: "Evening",
    status: "Pending",
  },
];

export const healthProfile = {
  name: "Lavanya",
  email: "you@example.com",
  dateOfBirth: "",
  phone: "",
  bloodGroup: "",
  gender: "",
  height: "",
  weight: "",
  allergies: "",
  medicalConditions: "",
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
};