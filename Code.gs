function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getParticipantData(inputPhone) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses');
  const data = sheet.getDataRange().getValues();

  inputPhone = String(inputPhone).replace(/\D/g, "");  // Remove non-numeric characters
  const inputLastEight = inputPhone.slice(-8);  // Get last 8 digits

  console.log("Searching for Last 8 Digits:", inputLastEight);

  for (let i = 1; i < data.length; i++) {
    let storedPhone = String(data[i][0]).replace(/\D/g, ""); // Normalize stored phone number
    let storedLastEight = storedPhone.slice(-8);  // Extract last 8 digits

    console.log("Row", i, "| Stored Last 8:", storedLastEight, "| Type:", typeof storedLastEight);

    if (storedLastEight === inputLastEight) {
      console.log("Match Found!");

      let arrivalDateTime = data[i][4] instanceof Date ? Utilities.formatDate(data[i][4], Session.getScriptTimeZone(), 'yyyy-MM-dd\'T\'HH:mm') : '';
      let departureDateTime = data[i][5] instanceof Date ? Utilities.formatDate(data[i][5], Session.getScriptTimeZone(), 'yyyy-MM-dd\'T\'HH:mm') : '';

      return {
        phone: storedPhone,
        name: data[i][1],  // Access Name (Index 1 for column B)
        allergies: data[i][2], // Access Address (Index 2 for column C)
        travel: data[i][3],
        arrivalDateTime: arrivalDateTime, // Formatted arrival DateTime
        departureDateTime: departureDateTime,

        departurePlace: data[i][6], // Access Address (Index 2 for column C)
        arrivalPlace: data[i][7],
        spotsNumber: data[i][8], // Formatted arrival DateTime
        driverName: data[i][9],
        mat: data[i][10],
        payed: data[i][11],
      };
    }
  }

  console.log("No Match Found for:", inputLastEight);
  return null;
}

function saveParticipantData(phone, newData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses');
  const data = sheet.getDataRange().getValues();

  phone = String(phone).replace(/\D/g, "");  // Store only numbers
  const lastEightDigits = phone.slice(-8);  // Compute last 8 digits

  console.log("Saving: Phone:", phone, "Last 8 Digits:", lastEightDigits, "New Data:", newData);

  for (let i = 1; i < data.length; i++) {
    let storedPhone = String(data[i][0]).replace(/\D/g, "");
    let storedLastEight = storedPhone.slice(-8);

    if (storedLastEight === lastEightDigits) {
      console.log("Updating Row:", i);
      sheet.getRange(i + 1, 1, 1, newData.length + 1).setValues([[phone, ...newData]]);
      return;
    }
  }

  console.log("Appending New Entry");
  sheet.appendRow([phone, ...newData]);
  sheet.getRange(sheet.getLastRow(), 1).setNumberFormat("@");  // Ensure phone is saved as text
}




