document.getElementById("createtablebutton").addEventListener('click', () => {
    createtable();
})
function createtable() {
    document.getElementById("tablecreator").innerHTML = `
    <div class="tablecontent">
        <h1>Create table</h1>
        <label for="tablename" class="bold-tablename">Table name</label>
        <input type="text" name="tablename" class="tablename" id="tablename"/>
        
            <div class="givenfieldname">
                <div class="heading-container"> 
                  <h2>Field name</h2>
                   <h2>Field type</h2>
                </div>
                <div class="field">
                    <ul class="fieldslist" id="fieldslist">
                        <li id="inputbox" class="listbox">
                          <div class="input-container">
                             <label for="fieldname"></label>
                             <input type="text" name="fieldname" class="fieldname">
                             <label for="fieldtype"></label>
                             <input type="text" name="fieldtype" class="fieldtype"> 
                          </div>
                        </li>
                    </ul>
                </div>
            </div>
       
        <div class="field-buttons">
            <button type="button" id="addField">Add Another Field</button>
        </div>
        <button type="button" id="tablecreation">Create table</button>
    </div>
    `;

    // Adding event listener after the table creation to ensure button is accessible
    document.getElementById("addField").addEventListener('click', function () {
        addNewField();
    });
    document.getElementById("tablecreation").addEventListener('click', function () {
        getTableFields();
    });
}
function addNewField() {
    // Create a new `li` element for the new field
    const newFieldLi = document.createElement('li');
    newFieldLi.className = 'listbox';
    // Add labels, inputs, and checkboxes inside the new `li` element
    newFieldLi.innerHTML = `
    <div class="input-container">
        <label for="fieldname"></label>
        <input type="text" name="fieldname" class="fieldname">
        <label for="fieldtype"></label>
        <input type="text" name="fieldtype" class="fieldtype">
     </div>  
    `;

    // Append the new field to the `ul` with class `fieldslist`
    document.querySelector('.fieldslist').appendChild(newFieldLi);
}


function getTableFields() {
    // Get the table name
    const tableName = document.getElementById("tablename").value;

    // Get all the fieldname and fieldtype inputs
    const fieldNames = document.querySelectorAll('.fieldname');
    const fieldTypes = document.querySelectorAll('.fieldtype');
   
    // Initialize an array to store field data
    const fields = [];

    // Loop through fieldname and fieldtype inputs to collect their values
    fieldNames.forEach((fieldNameInput, index) => {
        const fieldName = fieldNameInput.value;
        const fieldType = fieldTypes[index].value;

        // Push the fieldname and fieldtype as an object to the fields array
        fields.push({
            fieldName,
            fieldType
        });
    });

    // Log the values (you can process this data or send it to the server)
    // console.log("Table Name:", tableName);
    // console.log("Fields:", fields);
    //adding the backend here
    axios.post('http://localhost:3000/main/tablecreation',{tableName,fields})
    .then(()=>{
        
        gettablename();
    })
    .catch(err=>console.log(err))
}
function gettablename() {
   

    axios.get('http://localhost:3000/tables/fetch',)
      .then(response => {
          // Assuming response.data is the array of table names
          const tables = response.data;  // Not just `response.data[0]`
          console.log("fetched :",tables);  // Log the fetched table names to check the structure

          const tablelist = document.getElementById("tables_list");
          // Clear the existing table list
          tablelist.innerHTML = "";

          // Create a table list and append it to the smallbox
          tables.forEach(tablename => {
              const table = document.createElement("li");
              table.textContent = tablename;
              table.className = 'list';  // Assuming this class exists in your CSS
              table.addEventListener('click', () => {
                  fetchtable(tablename);
              });
              tablelist.appendChild(table);
          });
      })
      .catch(err => console.log("Error:", err));
}

// Call the fetchTableNames function when the page loads
window.onload = gettablename;

// function to fetch the table records
async function fetchtable (tablename){
      try{
          const fetcheddatum=await axios.get(`http://localhost:3000/tabless/${tablename}`)
        const fetcheddata=fetcheddatum.data.fetched_data;
        const fieldnames=fetcheddatum.data.fieldNames;
        createfetched(fetcheddata,fieldnames,tablename)
      }catch (err){
        console.log(err)
      }
}

//function to create a table in the large box
function createfetched (fetcheddata,fieldnames,tablename){
   const tablecreator=document.getElementById("tablecreator");
   // empty the largebox
   tablecreator.innerHTML="";
   
   const table=document.createElement("table");
   table.className='tablebox';
   const headerrow=document.createElement("tr")
   fieldnames.forEach(names=>{
      const headernames=document.createElement("th");
      headernames.textContent=names;
      headerrow.appendChild(headernames);
   })
   table.appendChild(headerrow);

   //populate the records
   fetcheddata.forEach(data=>{
    const recordrow=document.createElement("tr");
    Object.values(data).forEach(rowdata=>{
        const recordcellvalue=document.createElement("td")
        recordcellvalue.textContent=rowdata;
        recordrow.appendChild(recordcellvalue);    
    })
    table.appendChild(recordrow);
   })
   tablecreator.appendChild(table);

   const insertrec=document.createElement("button");
   insertrec.textContent="Insert new record"
   insertrec.className='insertrecord';
   insertrec.addEventListener('click',()=>{
    createInsertForm(fieldnames,tablename)
   })
   tablecreator.appendChild(insertrec);
}

// Function to create the insert form
 function createInsertForm(fieldnames,tablename) {
    // Check if the form already exists
    let existingForm = document.getElementById("insertForm");
    if (existingForm) {
        return; // Prevent creating multiple forms
    }

    const largeBox = document.querySelector(".large_box");

    // Create a form container
    const formContainer = document.createElement("div");
    formContainer.id = "insertForm";
    formContainer.className = "insert-form";

    // Create the form element
    const form = document.createElement("form");

    // Create form fields dynamically based on fieldnames
    fieldnames.forEach(fieldname => {
        const label = document.createElement("label");
        label.textContent = fieldname;
        const input = document.createElement("input");
        input.type = "text";
        input.name = fieldname;
        input.required = true;
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
    });

    // Create submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    // Append submit button to form
    form.appendChild(submitButton);

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Gather input values
        //using the FormData API to extract data from a form
        // and dynamically create a newRecord object based on the fieldnames array
        const formData = new FormData(form);
        const newRecord = {};
        
        fieldnames.forEach(fieldname => {
            //formData.get(fieldname) to retrieve the value 
            //from the form that corresponds to the field name
            newRecord[fieldname] = formData.get(fieldname);
        });

        console.log("New Record:", newRecord,tablename);
        // Here, you'd send the new record to the backend or handle it in the frontend
        // For now, let's just remove the form after submission
        
        axios.post('http://localhost:3000/insert/newrecord',{newRecord,tablename})
        .then(()=>{
             formContainer.remove();
             fetchtable (tablename)
        })
        .catch(err=>console.log(err))
        
        
    });

    // Append form to the form container
    formContainer.appendChild(form);

    // Insert the form container above the large box
    largeBox.parentNode.insertBefore(formContainer, largeBox);
}