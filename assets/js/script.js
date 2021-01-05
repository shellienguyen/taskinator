let formEl = document.querySelector( "#task-form" );
let taskToDoEl = document.querySelector( "#tasks-to-do" );
let taskIdCounter = 0;
let pageContentEl = document.querySelector( "#page-content" );
let tasksInProgressEl = document.querySelector( "#tasks-in-progress" );
let tasksCompleteEl = document.querySelector( "#tasks-completed" );

let taskFormHandler = function( event ) {
    
   event.preventDefault();
   let taskNameInput = document.querySelector( "Input[ name = 'task-name' ]" ).value;
   let taskTypeInput = document.querySelector( "select[ name = 'task-type' ]").value;

   // Check if input values are empty strings
   if ( !taskNameInput || !taskTypeInput ) {
      alert( "You need to fill out the task form!" );
      return false;
   };

   formEl.reset();

   let isEdit = formEl.hasAttribute( "data-task-id" );

   // If has data attribute, get task id and call function to complete edit process
   if ( isEdit ) {
      let taskId = formEl.getAttribute( "data-task-id" );
      completeEditTask( taskNameInput, taskTypeInput, taskId );
   }
   // Else if no data attribute, create new object and pass to createTaskEl function
   else {
      // Package up data as an object
      let taskDataObj = {
         name: taskNameInput,
         type: taskTypeInput
      };

      createTaskEl( taskDataObj );
   };
};

let completeEditTask = function( taskName, taskType, taskId ) {
   // Find the matching task list item
   let taskSelected = document.querySelector( ".task-item[ data-task-id = '" + taskId + "' ]" );

   // Set new updated values
   taskSelected.querySelector( "h3.task-name" ).textContent = taskName;
   taskSelected.querySelector( "span.task-type" ).textContent = taskType;

   alert( "Task updated!" );

   // Reset the form by removing task id and reset button
   formEl.removeAttribute( "data-task-id" );
   document.querySelector( "#save-task" ).textContent = "Add Task";
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
};

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
};

formEl.addEventListener( "submit", taskFormHandler );

let deleteTask = function( taskId ) {
   let taskSelected = document.querySelector( ".task-item[data-task-id = '" + taskId + "' ]" );
   taskSelected.remove();
   console.log( taskSelected );
};

let editTask = function( taskId ) {
   console.log( "Editing task#" + taskId );

   // Get task list item element
   let taskSelected = document.querySelector( ".task-item[data-task-id = '" + taskId + "' ]" );

   // Get content from task name and type
   let taskName = taskSelected.querySelector( "h3.task-name" ).textContent;
   let taskType = taskSelected.querySelector( "span.task-type" ).textContent;

   // Reuse the selectors to update the form
   document.querySelector( "input[ name = 'task-name' ]" ).value = taskName;
   document.querySelector( "select[ name = 'task-type' ]" ).value = taskType;

   // Update the text of the submit button so the user knows we are in edit mode
   document.querySelector( "#save-task" ).textContent = "Save Task";

   // Add task id
   formEl.setAttribute( "data-task-id", taskId );
};

let taskButtonHandler = function( event ) {
   // Get target element from event
   let targetEl = event.target;

   // If edit button was clicked
   if ( targetEl.matches( ".edit-btn" )) {
      let taskId = targetEl.getAttribute( "data-task-id" );
      editTask( taskId );
   }
   // If delete button was clicked
   else if ( event.target.matches( ".delete-btn" )) {
      // Get the element's task id
      let taskId = event.target.getAttribute( "data-task-id" );
      deleteTask( taskId );
   };
};

let taskStatusChangeHandler = function( event ) {
   // Get the task item's id
   let taskId = event.target.getAttribute( "data-task-id" );
   
   // Get the currently selected option's value and convert to lowercase
   let statusValue = event.target.value.toLowerCase();

   // Find the parent task item element based on the id
   let taskSelected = document.querySelector( ".task-item[ data-task-id = '" + taskId + "' ]" );

   // Please the task in the appropriate column
   if ( statusValue === "to do" ) {
      taskToDoEl.appendChild( taskSelected );
   }
   else if ( statusValue === "in progress" ) {
      tasksInProgressEl.appendChild( taskSelected );
   }
   else if ( statusValue === "completed" ) {
      tasksCompleteEl.appendChild( taskSelected );
   };

};

pageContentEl.addEventListener( "click", taskButtonHandler );
pageContentEl.addEventListener( "change", taskStatusChangeHandler );