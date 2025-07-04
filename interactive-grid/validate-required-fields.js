apex.message.clearErrors();  // Clear previous errors
let hasError = false; // Flag to control page submission

// Validation function
function validateGrid(regionId, fields) {
  const widget = apex.region(regionId).widget();
  const grid = widget.interactiveGrid('getViews', 'grid');
  const model = grid.model; // Iterate over all rows in the model
  // To validate only selected rows, you could use:
  // const model = grid.view$.grid("getSelectedRecords");

  model.forEach(row => {
    const recordId = model.getRecordId(row);

    fields.forEach(({ column, label }) => {
      const valueObj = model.getValue(row, column);
      const value = valueObj && typeof valueObj === 'object' ? valueObj.v : valueObj; // Ensures that the column is handled correctly, whether it is a simple text field or a Select List.

      if (!value) {
        apex.message.showErrors([{
          type: "error",
          location: "page",
          message: `<a href="#" class="a-Notification-link" data-region="${regionId}" data-record="${recordId}" data-column="${column}">${label} must be entered!</a>`, // This creates a clickable error message that navigates to the specific column cell.
          unsafe: false           // False ensures the HTML in the message is rendered correctly and prevents XSS vulnerabilities.
        }]);
        hasError = true;
      }
    });
  });
}


// --- Call the validateGrid function for your Interactive Grids ---

// Validate grid columns
validateGrid('IG_STATIC_ID', [  //  Replace 'IG_STATIC_ID' with your Interactive Grid's Static ID
  { column: "COLUMN_NAME_1", label: "COLUMN_HEADING_1" }, // The column label will be added next to the text 'must be entered' 
  { column: "COLUMN_NAME_2", label: "COLUMN_HEADING_2" }
]);



// Submit if no errors
if (!hasError) {
  apex.submit({ request: 'BUTTON_NAME', showWait: true }); // ShowWait: ture to display the spinner wait indicator
}
