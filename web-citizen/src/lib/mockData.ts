// src/lib/mockData.ts

export interface Applicant {
    secretHash: string;
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
}

const firstNames = ["Juan", "Maria", "Jose", "Ana", "Pedro", "Liza", "Mark", "Sofia", "Carlos", "Elena", "Miguel", "Isabella", "Andres", "Camila", "Diego", "Valentina", "Ricardo", "Lucia"];
const lastNames = ["Dela Cruz", "Santos", "Reyes", "Garcia", "Bautista", "Ocampo", "Torres", "Flores", "Rivera", "Gomez"];
const driverAddress = ["Caloocan City", "Manila", "Quezon City", "Pasig", "Makati", "Taguig", "Parañaque"];
const bloodTypes = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getMockApplicant(): Applicant {
    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
    const address = driverAddress[getRandomInt(0, driverAddress.length - 1)];
    const bloodType = bloodTypes[getRandomInt(0, bloodTypes.length - 1)];
    
    const licenseID = `N01-26-${getRandomInt(100000, 999999)}`;
    const birthYear = getRandomInt(1970, 2005);
    const birthMonth = String(getRandomInt(1, 12)).padStart(2, '0');
    const birthDay = String(getRandomInt(1, 28)).padStart(2, '0');

    return {
        secretHash: getRandomInt(100000000, 999999999).toString(),
        licenseID: licenseID,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
        licenseType: "Non-Professional",
        expirationDate: "2036-04-21",
        restrictions: "1, 2",
        conditions: "None",
        bloodType: bloodType,
        addressCity: address
    };
}
