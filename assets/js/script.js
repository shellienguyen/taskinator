let formEl = document.querySelector( "#task-form" );
let taskToDoEl = document.querySelector( "#tasks-to-do" );
let taskIdCounter = 0;
let pageContentEl = document.querySelector( "#page-content" );

let taskFormHandler = function( event ) {
    
   event.preventDefault();
   let taskNameInput = document.querySelector( "Input[ name = 'task-name' ]" ).value;
   let taskTypeInput = document.querySelector( "select[ name = 'task-type' ]").value;

   // Check if input values are empty strings
   if ( !taskNameInput || !taskTypeInput ) {
      alert( "You need to fill out the task form!" );
      return false;
   }

   formEl.reset();

   // Package up data as an object
   let taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
   };

   //Send it as an argument to createTaskEl
   createTaskEl( taskDataObj );
};

let createTaskEl = function( taskDataObj ) {

   // Create list item
   let listItemEl = document.createElement( "li" );
   listItemEl.className = "task-item";

   // Add task id as a custom attribute
   listItemEl.setAttribute( "data-task-id", taskIdCounter );

   // Create div to hold task info and add to list item
   let taskInfoEl = document.createElement( "div" );

   // Give it a class name
   taskInfoEl.className = "task-info";

   // Add HTML content to div
   taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
   listItemEl.appendChild( taskInfoEl );

   let taskActionsEl = createTaskActions( taskIdCounter );
   listItemEl.appendChild( taskActionsEl );
   console.log( taskActionsEl );

   // Add entire list item to list
   taskToDoEl.appendChild( listItemEl );

   // Increase task counter for the next unique id
   taskIdCounter++;
}

let createTaskActions = function( taskId ) {
   let actionContainerEl = document.createElement( "div" );
   actionContainerEl.className = "task-actions";

   // Create edit button
   let editButtonEl = document.createElement( "button" );
   editButtonEl.textContent = "Edit";
   editButtonEl.className = "btn edit-btn";
   editButtonEl.setAttribute( "data-task-id", taskId );

   actionContainerEl.appendChild( editButtonEl );

   // Create delete button
   let deletButtonEl = document.createElement( "button" );
   deletButtonEl.textContent = "Delete";
   deletButtonEl.className = "btn delete-btn";
   deletButtonEl.setAttribute( "data-task-id", taskId );

   actionContainerEl.appendChild( deletButtonEl );

   // Create drop-down status menu
   let statusSelectEl = document.createElement( "select" );
   statusSelectEl.className = "select-status";
   statusSelectEl.setAttribute( "name", "status-change" );
   statusSelectEl.setAttribute( "data-task-id", taskId );

   actionContainerEl.appendChild( statusSelectEl );

   // Populate the drop-down status menu
   let statusChoices = [ "To Do", "In Progress", "Completed" ];
   for ( let i = 0; i < statusChoices.length; i++ ) {
      // Create option element
      let statusOptionEl = document.createElement( "option" );
      statusOptionEl.textContent = statusChoices[ i ];
      statusOptionEl.setAttribute( "value", statusChoices[ i ]);
      
      // Append to select
      statusSelectEl.appendChild( statusOptionEl );
   };

   return actionContainerEl;
}

formEl.addEventListener( "submit", taskFormHandler );

let deleteTask = function( taskId ) {
   let taskSelected = document.querySelector( ".task-item[data-task-id = '" + taskId + "' ]" );
   taskSelected.remove();
   console.log( taskSelected );
};

let taskButtonHandler = function( event ) {
   console.log( event.target );

   if ( event.target.matches( ".delete-btn" )) {
      // Get the element's task id
      let taskId = event.target.getAttribute( "data-task-id" );
      deleteTask( taskId );
   };
};

pageContentEl.addEventListener( "click", taskButtonHandler );