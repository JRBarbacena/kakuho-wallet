// utils/mockData.js

const firstNames = ["Juan", "Maria", "Jose", "Ana", "Pedro", "Liza", "Mark", "Sofia", "Carlos", "Elena", "Miguel", "Isabella", "Andres", 
                    "Camila", "Diego", "Valentina", "Ricardo", "Lucia", "Fernando", "Gabriela", "Jorge", "Natalia", "Alberto", "Samantha", 
                    "Rafael", "Diana", "Enrique", "Carla", "Manuel", "Paula", "Alfredo", "Vanessa", "Eduardo", "Lorena", "Oscar", "Claudia", 
                    "Raul", "Veronica", "Sergio", "Marta", "Hector", "Gloria", "Armando", "Yolanda", "Federico", "Adriana", "Gustavo", "Monica", 
                    "Rosa", "Victor", "Sonia", "Emilio", "Carmen", "Javier", "Teresa", "Salvador", "Lorena", "Enrique", "Carla", "Manuel", 
                    "Paula", "Alfredo", "Vanessa", "Eduardo", "Lorena", "Oscar", "Claudia", "Raul", "Veronica", "Sergio", "Marta", "Hector", "Gloria", 
                    "Armando", "Yolanda", "Federico", "Adriana","Gustavo", "Rosa", "Victor", "Sonia", "Emilio", "Carmen", "Javier", "Teresa", "Salvador"];

const lastNames = ["Dela Cruz", "Santos", "Reyes", "Garcia", "Bautista", "Ocampo", "Torres", "Flores", "Rivera", "Gomez", "Mendoza", "Vargas", 
                    "Ramos", "Cruz", "Ortiz", "Navarro", "Silva", "Morales", "Castillo", "Alvarez", "Romero", "Sanchez", "Fernandez", "Gonzalez", 
                    "Perez", "Diaz", "Martinez", "Lopez", "Hernandez", "Guzman", "Jimenez", "Vazquez", "Sosa", "Mora", "Rojas", "Cabrera", "Salazar", 
                    "Pena", "Valdez", "Maldonado", "Campos", "Aguilar", "Fuentes", "Cortes", "Estrada", "Villanueva", "Solis", "Macias", "Bravo", 
                    "Delo Santos", "Roldan", "Vega", "Serrano", "Marquez", "Cano", "Paredes", "Guerra", "Soto", "Velasquez", "Carmona", "Mendez", 
                    "Rivas", "Luna", "Castro", "Salinas", "Ponce", "Valencia", "Montoya", "Ramos", "Vidal", "Cruz", "Santiago", "Molina", "Herrera", 
                    "Garrido", "Vargas", "Sanchez", "Romero", "Alvarez", "Gomez", "Diaz"];

const driverAddress = ["Caloocan City", "Manila", "Quezon City", "Pasig", "Makati", "Taguig", "Parañaque", "Las Piñas", "Mandaluyong", "Marikina", 
                        "Valenzuela", "San Juan", "Pasay", "Pateros", "Navotas", "Malabon", "Cavite City", "Imus", "Bacoor", "Dasmariñas", "General Trias", 
                        "Trece Martires", "Silang", "Kawit", "Noveleta", "Rosario", "Gen. Mariano Alvarez", "Amadeo", "Indang", "Magallanes", "Mendez", "Naic", 
                        "Tanza", "Carmona", "GMA", "Tagaytay", "Ternate", "Trece Martires", "Amadeo", "Indang", "Magallanes", "Mendez", "Naic", "Tanza",
                        "Carmona", "GMA", "Tagaytay"];

const bloodTypes = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

// Official LTO PH Restrictions & Conditions
const conditions = ["None", "A - Wear Eyeglasses", "B - Drive with Special Equipment", "C - Special Equipment Lower Limbs", "A, B"];
const restrictions = ["1", "2", "1, 2", "None"];
const licenseTypes = ["Non-Professional"];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getMockApplicant() {
    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
    const address = driverAddress[getRandomInt(0, driverAddress.length - 1)];
    const bloodType = bloodTypes[getRandomInt(0, bloodTypes.length - 1)];
    
    // Generate an LTO format ID (e.g., N01-26-123456)
    const licenseID = `N01-26-${getRandomInt(100000, 999999)}`;
    const birthYear = getRandomInt(1970, 2005);
    const birthMonth = String(getRandomInt(1, 12)).padStart(2, '0');
    const birthDay = String(getRandomInt(1, 28)).padStart(2, '0');

    // Return the exact JSON format your API expects!
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
