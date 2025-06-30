import { Request, Response } from "express"; 'express';

const todos = [
      {id:1, text:'milk', completeAt: new Date() },
      {id:2, text:'bread', completeAt: new Date() },
      {id:3, text:'butter', completeAt: null },
    ];
export class TodosController {

  constructor () {}

  public getTodos = (req:Request ,res:Response) =>{
    res.json(todos);
  };
  
  public getTodoById = (req:Request, res:Response) =>{
    const id = +req.params.id;
    if( isNaN(id)) res.status(400).json({error: 'ID argument is not a number'});
    const todo = todos.find(todo => todo.id === id);
    (todo)
      ? res.json(todo)
      : res.status(404).json({error: `TODO with id ${id} not found`})
  };

  public createTodo = (req:Request, res:Response)=>{
    const { text } = req.body;
    if(!text) res.status(400).json({error: 'Text property is requered'});
    const newTodo = {
      id: todos.length +1,
      text: text,
      completeAt: null
    }
    todos.push(newTodo);
    res.json(newTodo);
  };


  public updateTodo = (req:Request, res:Response) => {
    const id = +req.params.id;
    if( isNaN(id)) res.status(400).json({error: 'ID argument is not a number'});

    const todo = todos.find(todo => todo.id === id);
    if( !todo) res.status(404).json({error: `Todo with id ${ id } not found`});

    const {text, completeAt} = req.body;

    if (todo) {
      todo.text = text || todo.text;
      (completeAt === 'null')
        ?todo.completeAt = null
        : todo.completeAt = new Date (completeAt || todo,completeAt);  
    }
    res.json(todo);
  };

  public deleteTodo = (req:Request, res:Response) => {
    const id = +req.params.id;

    const todo = todos.find(todo => todo.id === id );
    if ( !todo )  res.status(404).json({ error: `Todo with id ${ id } not found` });

    res.json( todo );

  };
}