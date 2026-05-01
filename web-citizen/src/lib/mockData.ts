export type CitizenSubject = {
  licenseID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseType: string;
  expirationDate: string;
  restrictions: string;
  conditions: string;
  bloodType: string;
  addressCity: string;
};

export type MockCitizen = {
  subject: CitizenSubject;
};

const mockCitizens: MockCitizen[] = [
  { subject: { licenseID: "N01-26-711462", firstName: "Salvador", lastName: "Fernandez", dateOfBirth: "1975-06-06", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "AB+", addressCity: "Carmona" } },
  { subject: { licenseID: "N01-26-827265", firstName: "Gloria", lastName: "Molina", dateOfBirth: "2002-07-16", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "A-", addressCity: "Silang" } },
  { subject: { licenseID: "N01-26-889112", firstName: "Manuel", lastName: "Luna", dateOfBirth: "1987-01-27", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O+", addressCity: "GMA" } },
  { subject: { licenseID: "N01-26-759441", firstName: "Lucia", lastName: "Soto", dateOfBirth: "2000-08-04", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "B+", addressCity: "Pasig" } },
  { subject: { licenseID: "N01-26-123419", firstName: "Salvador", lastName: "Diaz", dateOfBirth: "1979-12-27", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O+", addressCity: "Bacoor" } },
  { subject: { licenseID: "N01-26-210879", firstName: "Oscar", lastName: "Bravo", dateOfBirth: "1997-03-16", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "AB+", addressCity: "Gen. Mariano Alvarez" } },
  { subject: { licenseID: "N01-26-484720", firstName: "Diana", lastName: "Garrido", dateOfBirth: "1996-06-11", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "B-", addressCity: "Caloocan City" } },
  { subject: { licenseID: "N01-26-563853", firstName: "Teresa", lastName: "Delo Santos", dateOfBirth: "2003-05-22", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O-", addressCity: "General Trias" } },
  { subject: { licenseID: "N01-26-493916", firstName: "Marta", lastName: "Rojas", dateOfBirth: "1989-12-16", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O-", addressCity: "Cavite City" } },
  { subject: { licenseID: "N01-26-836889", firstName: "Eduardo", lastName: "Vega", dateOfBirth: "1995-10-06", licenseType: "Non-Professional", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "A+", addressCity: "Marikina" } },
];

export default mockCitizens;
