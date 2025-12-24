const { Command } = require("commander");
const fs = require("fs");

const program  = new Command();

program
  .name("todo")
  .description("a simple todo list")
  .version("1.0.0")

// add todo item
program
  .command("add <todoItem>")
  .description("add the given todo")
  .action((todoItem) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
      let todos = [];
      if(!err && data) todos = JSON.parse(data);
      todos.push({id : todos.length + 1, todo : todoItem});

      fs.writeFile("todos.json", JSON.stringify(todos, null, 2), "utf-8", (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Todo added successfully!");
      });

    });
  });  

// delete todo item  
program
  .command("delete <todoItem>")
  .description("delete the given todo")
  .action((todoItem) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if(!data){
        console.log("Todo list is empty!");
        return;
      }
      if(err){
        console.error(err);
        return;
      }
      let todos = JSON.parse(data);

      let found = todos.find(t => t.todo === todoItem);
      if(!found){
        console.log("Given todo not present!");
        return;
      }

      todos = todos.filter(t => t.todo !== todoItem);

      todos.forEach((t, i) => t.id = i+1);

      fs.writeFile("todos.json", JSON.stringify(todos, null, 2), "utf-8", err => {
        if(err){
          console.error(err);
          return;
        }
        console.log("Todo deleted successfully!")
      });
    });
  });  

//update todo item
program
  .command("update <todoItem> <updatedTodo>")
  .description("update the given todo")
  .action((todoItem, updatedTodo) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if(err){
        console.error(err);
        return;
      }
      if(!data){
        console.log("Todo list is empty!");
        return;
      }
      let todos = JSON.parse(data);

      let target = todos.find(t => t.todo === todoItem);
      if(!target){
        console.log("Given todo not present!");
        return;
      }

      target.todo = updatedTodo;

      fs.writeFile("todos.json", JSON.stringify(todos, null, 2), "utf-8", err => {
        if(err){
          console.error(err);
          return;
        }
        console.log("Todo updated successfully!");
      });
    });
  });

program.parse(process.argv);
