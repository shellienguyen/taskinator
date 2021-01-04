var formEl = document.querySelector( "#task-form" );
var taskToDoEl = document.querySelector( "#tasks-to-do" );

var createTaskHandler = function( event ) {
    
   event.preventDefault();

   var taskNameInput = document.querySelector( "Input[ name = 'task-name' ]" ).value;
   var taskTypeInput = document.querySelector( "select[ name = 'task-type' ]").value;
   console.log( "taskNameInput: " + taskNameInput );
   console.log( "taskTypeInput: " + taskTypeInput );

   // Create list item
   var listItemEl = document.createElement( "li" );
   listItemEl.className = "task-item";

   // Create div to hold task info and add to list item
   var taskInfoEl = document.createElement( "div" );

   // Give it a class name
   taskInfoEl.className = "task-info";

   // Add HTML content to div
   taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskNameInput + "</h3><span class = 'task-type'>" + taskTypeInput + "</span>";
   listItemEl.appendChild( taskInfoEl );

   // Add entire list item to list
   taskToDoEl.appendChild( listItemEl );
};

formEl.addEventListener( "submit", createTaskHandler );