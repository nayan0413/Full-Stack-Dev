const { Command } = require("commander");
const fs = require("fs").promises;

const program  = new Command();

async function readTodos() {
    try{
        const data = await fs.readFile("todos.json", "utf-8");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

async function writeTodos(todos) {
    await fs.writeFile("todos.json", JSON.stringify(todos, null, 2), "utf-8");
}

program
  .name("todo")
  .description("a simple todo list")
  .version("1.0.0")

// add todo item
program
  .command("add <todoItem>")
  .description("add the given todo")
  .action(async (todoItem) => {
    let todos = await readTodos();
    todos.push({id : todos.length + 1, todo : todoItem});

    await writeTodos(todos);
    console.log("Todo added successfully!");
  });  

// delete todo item  
program
  .command("delete <todoItem>")
  .description("delete the given todo")
  .action(async (todoItem) => {
    let todos = await readTodos();
    if(!todos.length){
        console.log("Todo list is empty!");
        return;
    }

    let found = todos.find(t => t.todo === todoItem);
    if(!found){
        console.log("Given todo not present!");
        return;
    }

    todos = todos.filter(t => t.todo !== todoItem);

    todos.forEach((t, i) => t.id = i+1);

    await writeTodos(todos);
    console.log("Todo deleted successfully!");
  });  

//update todo item
program
  .command("update <todoItem> <updatedTodo>")
  .description("update the given todo")
  .action(async (todoItem, updatedTodo) => {
    let todos = await readTodos();
    if(!todos.length){
        console.log("Todo list is empty!");
        return;
    }

    let target = todos.find(t => t.todo === todoItem);
    if(!target){
        console.log("Given todo not present!");
        return;
    }

    target.todo = updatedTodo;
    
    await writeTodos(todos);
    console.log("Todo updated successfully!");
  });

program.parse(process.argv);