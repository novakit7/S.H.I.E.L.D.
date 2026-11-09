export const campusKnowledge = {
  campusName: '[Campus name not supplied]',
  departments: '[Verified department information not supplied]',
  library: '[Verified library location, hours, and contact information not supplied]',
  hostel: '[Verified hostel information not supplied]',
  canteen: '[Verified canteen information not supplied]',
  campusFacilities: '[Verified campus facility information not supplied]',
  importantOffices: '[Verified office contact information not supplied]',
  campusProcedures: '[Verified campus procedure information not supplied]',
  emergencyContacts: '[Verified emergency contacts not supplied]',
};

export const getCampusKnowledge = () => JSON.stringify(campusKnowledge, null, 2);
