const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
let ID = 3;

// const changeid = () => {
//     ID = ID + 1;
//     console.log(ID);
// }

const loadTodos = () => {
    try {
        const dataBuffer = fs.readFileSync("data.json");
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        console.error(e);
        return [];
    }
};

const listTodos = () => {
    const todos = loadTodos();
    for (const todo of todos) {
        console.log(todo);
    }
}

const saveTodos = (id, todo, complete) => {
    const todos = loadTodos();
    const largestid = todos[todos.length - 1].id;
    id = largestid + 1;
    todos.push({ id, todo, complete });
    const dataJSON = JSON.stringify(todos);
    fs.writeFileSync("data.json", dataJSON);
};

const deleteTodos = (id) => {
    const todos = loadTodos().filter(item => item.id !== id);
    const dataJSON = JSON.stringify(todos);
    fs.writeFileSync("data.json", dataJSON);
};

const toggleTodos = (id) => {
    const todos = loadTodos();
    const index = loadTodos().findIndex(item => item.id === id);
    todos[index].complete = !todos[index].complete;
    const dataJSON = JSON.stringify(todos);
    fs.writeFileSync("data.json", dataJSON);
};

yargs.command({
    command: "add",
    describe: "Add a new todo",
    builder: {
        id: {
            describe: "Todo id",
            demandOption: false,
            type: "number",
        },
        todo: {
            describe: "Todo content",
            demandOption: true,
            type: "string"
        },
        complete: {
            describe: "Todo status",
            demandOption: false,
            type: "boolean",
            default: false
        }
    },
    handler: function (argv) {
        saveTodos(argv.id, argv.todo, argv.complete);
    }
});

yargs.command({
    command: "delete",
    describe: "delete a new todo",
    builder: {
        id: {
            describe: "Todo id",
            demandOption: true,
            type: "number"
        }
    },
    handler: function (argv) {
        deleteTodos(argv.id);
    }
});

yargs.command({
    command: "toggle",
    describe: "toggle a todo",
    builder: {
        id: {
            describe: "Todo id",
            demandOption: true,
            type: "number"
        }
    },
    handler: function (argv) {
        toggleTodos(argv.id);
    }
});

yargs.command({
    command: "list",
    describe: "list todos",
    builder: {
        complete: {
            describe: "Todo status",
            demandOption: false,
            type: "boolean",
            default: 'all'
        }
    },
    handler: function (argv) {
        const todos = loadTodos();
        for (let { todo, complete } of todos) {
            if (argv.complete === 'all') {
                if (complete) {
                    console.log(chalk.green(todo))
                } else {
                    console.log(chalk.red(todo))
                }
            } else if (complete === argv.complete) {
                if (complete) {
                    console.log(chalk.green(todo, complete))
                } else {
                    console.log(chalk.red(todo, complete))
                }
            }
        };
    }
});

yargs.parse();
