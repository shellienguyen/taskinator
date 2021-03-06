let formEl = document.querySelector( "#task-form" );
let taskToDoEl = document.querySelector( "#tasks-to-do" );
let taskIdCounter = 0;
let pageContentEl = document.querySelector( "#page-content" );
let tasksInProgressEl = document.querySelector( "#tasks-in-progress" );
let tasksCompleteEl = document.querySelector( "#tasks-completed" );
let tasks = [];



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
         type: taskTypeInput,
         status: "to do"
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

   // Loop through tasks array and task object with new content
   // At each iteration, check to see if the individual task's id property
   //   matches the taskId argument passed into completeEditTask()
   for ( let i = 0; i < tasks.length; i++ ) {
      if ( tasks[ i ].id === parseInt( taskId )) {
         tasks[ i ].name = taskName;
         tasks[ i ].type = taskType;
      };
   };

   // Save tasks array to localStorage
   saveTasks();

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

   // Make each <li> task draggable
   listItemEl.setAttribute( "draggable", "true" );

   // Create div to hold task info and add to list item
   let taskInfoEl = document.createElement( "div" );

   // Give it a class name
   taskInfoEl.className = "task-info";

   // Add HTML content to div
   taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
   listItemEl.appendChild( taskInfoEl );

   taskDataObj.id = taskIdCounter;
   tasks.push( taskDataObj );

   // Save tasks array to localStorage
   saveTasks();

   let taskActionsEl = createTaskActions( taskIdCounter );
   listItemEl.appendChild( taskActionsEl );

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



let deleteTask = function( taskId ) {
   let taskSelected = document.querySelector( ".task-item[data-task-id = '" + taskId + "' ]" );
   taskSelected.remove();

   // Create a new array to hold updated list of tasks
   let updatedTaskArr = [];

   // Loop through current tasks
   for ( let i = 0; i < tasks.length; i++ ) {
      // If tasks[ i ].id doesn't match the value of taskId, let's keep that task
      //   and push it into the new array
      if ( tasks[ i ].id !== parseInt( taskId )) {
         updatedTaskArr.push( tasks[ i ] );
      };
   };

   // Reassign tasks array to be the same as updatedTaskArr
   tasks = updatedTaskArr;

   // Save tasks array to localStorage
   saveTasks();
};



let editTask = function( taskId ) {

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

   // Update tasks in tasks array
   for ( let i = 0; i < tasks.length; i++ ) {
      if ( tasks[ i ].id === parseInt( taskId )) {
         tasks[i].status = statusValue;
      };
   };

   // Save tasks array to localStorage
   saveTasks();
};



let dragTaskHandler = function( event ) {
   let taskId = event.target.getAttribute( "data-task-id" );
   event.dataTransfer.setData( "text/plain", taskId );

   let getId = event.dataTransfer.getData( "text/plain" );
};



let dropZoneDragHandler = function( event ) {
   //Look for the closest ancestor element
   let taskListEl = event.target.closest( ".task-list" );
   if ( taskListEl ) {
      // Prevent task item from bouncing back to its original position,
      //   which is the default behavior
      event.preventDefault();

      taskListEl.setAttribute( "style", "background: rgba( 68, 233, 255, 0.7 ); border-style: dashed;" );
   }
};



let dropTaskHandler = function( event ) {
   let id = event.dataTransfer.getData( "text/plain" );
   let draggableElement = document.querySelector( "[ data-task-id = '" + id + "' ]" );
   let dropZoneEl = event.target.closest( ".task-list" );
   let statusType = dropZoneEl.id;
   
   // Set status of task based on dropZone id
   let statusSelectEl = draggableElement.querySelector( "select[ name = 'status-change' ]" );
 
   // Reassign task using the id property to identify the new task status
   if ( statusType === "tasks-to-do" ) {
      statusSelectEl.selectedIndex = 0;
   }
   else if ( statusType === "tasks-in-progress" ) {
      statusSelectEl.selectedIndex = 1;
   }
   else if ( statusType === "tasks-completed" ) {
      statusSelectEl.selectedIndex = 2;
   };

   // Remove temporary hover-over style once done hovering
   dropZoneEl.removeAttribute( "style" );

   // Append the task to its new parent
   dropZoneEl.appendChild( draggableElement );
   
   // Loop through tasks array to find and update the updated task's status
   for ( let i = 0; i < tasks.length; i++ ) {
      if ( tasks[ i ].id === parseInt( id )) {
         tasks[ i ].status = statusSelectEl.value.toLowerCase();
      };
   };

   // Save tasks array to localStorage
   saveTasks();
};



let dragLeaveHandler = function( event ) {
   let taskListEl = event.target.closest( ".task-list" );
   if ( taskListEl ) {
      taskListEl.removeAttribute( "style" );
   };
};



let saveTasks = function() {
   localStorage.setItem( "tasks", JSON.stringify( tasks ));
};



let isEmpty = function( str ) {
   return ( ( !str ) || ( 0 === str.length ) || ( str === null ));
};



/* Get task items from localStorage
Convert tasks from the string format back into an array of objects
Iterate through the tasks array and create task elements on the page from that
 */
let loadTasks = function() {
   let tempStr = localStorage.getItem( "tasks" );

   if ( isEmpty( tempStr )) {
      tasks = [];
      return false;
   };

   tasks = JSON.parse( tempStr );

   // Iterate through the array and print the tasks to the page
   for ( let i = 0; i < tasks.length; i++ ){
      tasks[ i ].id = taskIdCounter;
      console.log( "i: " + i );
      console.log( "taskIdCounter: " + taskIdCounter ) ;
      console.log( "tasks[ i ].name: " + tasks[ i ].name ) ;
      console.log( "tasks[ i ].type: " + tasks[ i ].type ) ;

      // Create list item
      let listItemEl = document.createElement( "li" );
      listItemEl.className = "task-item";

      // Add task id as a custom attribute
      listItemEl.setAttribute( "data-task-id", tasks[ i ].id );

      // Make each <li> task draggable
      listItemEl.setAttribute( "draggable", "true" );

      // Create div to hold task info and add to list item
      let taskInfoEl = document.createElement( "div" );

      // Give it a class name
      taskInfoEl.className = "task-info";

      // Add HTML content to div
      taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + tasks[ i ].name + "</h3><span class = 'task-type'>" + tasks [ i ].type + "</span>";
      listItemEl.appendChild( taskInfoEl );

      let taskActionsEl = createTaskActions( tasks[ i ].id );
      listItemEl.appendChild( taskActionsEl );

      if ( tasks[ i ].status === "to do" ) {
         listItemEl.querySelector( "select[ name = 'status-change' ]" ).selectedIndex = 0;
         // Add entire list item to list
         taskToDoEl.appendChild( listItemEl );
      }
      else if ( tasks[ i ].status === "in progress" ) {
         listItemEl.querySelector( "select[ name = 'status-change' ]" ).selectedIndex = 1;
         tasksInProgressEl.appendChild( listItemEl );
      }
      else if ( tasks[ i ].status === "completed" ) {
         listItemEl.querySelector( "select[ name = 'status-change' ]" ).selectedIndex = 2;
         tasksCompleteEl.appendChild( listItemEl );
      };

      taskIdCounter++;
   };
};



/* let loadTasks = function() {
   let savedTasks = localStorage.getItem( "tasks" );

   if ( !savedTasks ) {
      return false;
   };

   savedTasks = JSON.parse( savedTasks );

   // Loop through savedTasks array to load and display each task
   for ( let i = 0; i < savedTasks.length; i++ ) {
      // Pass each task object into the createTaskEl() function
      createTaskEl( savedTasks[ i ]);
      console.log( "i: " + i );
      console.log( savedTasks[ i ].id );
      console.log( savedTasks[ i ].name );
      console.log( savedTasks[ i ].type );
      console.log( savedTasks[ i ].status );
   }
}; */



document.addEventListener( "DOMContentLoaded", function() { loadTasks(); });
formEl.addEventListener( "submit", taskFormHandler );
pageContentEl.addEventListener( "click", taskButtonHandler );
pageContentEl.addEventListener( "change", taskStatusChangeHandler );
pageContentEl.addEventListener( "dragstart", dragTaskHandler );
pageContentEl.addEventListener( "dragover", dropZoneDragHandler );
pageContentEl.addEventListener( "drop", dropTaskHandler );
pageContentEl.addEventListener( "dragleave", dragLeaveHandler );