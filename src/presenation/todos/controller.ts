import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos";


export class TodosController {

  constructor () {}

  public getTodos = async(req:Request ,res:Response) =>{
    const todos = await prisma.todo.findMany();
    res.json(todos);
  };
  
  public getTodoById = async(req:Request, res:Response) =>{
    const id = +req.params.id;
    if( isNaN(id)) res.status(400).json({error: 'ID argument is not a number'});
    const todo = await prisma.todo.findFirst({
      where: {id}
    });
    (todo)
      ? res.json(todo)
      : res.status(404).json({error: `TODO with id ${id} not found`})
  };

  public createTodo = async(req:Request, res:Response)=>{
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if(error) res.status(400).json({error});

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });
    res.json(todo);
  };


  public updateTodo = async(req:Request, res:Response) => {
    const id = +req.params.id;
    if( isNaN(id)) res.status(400).json({error: 'ID argument is not a number'});

    const todo = await prisma.todo.findFirst({
      where: {id}
    });
    if( !todo) res.status(404).json({error: `Todo with id ${ id } not found`});

    const { text, completedAt } = req.body;
    const updateTodo = prisma.todo.update({
      where: {id},
      data: {text, 
        completedAt: (completedAt) ? new Date(completedAt) : null
      }
    });
    res.json(updateTodo);
  };

  public deleteTodo = async(req:Request, res:Response) => {
    const id = +req.params.id;
    const todo = await prisma.todo.findFirst({
      where: {id}
    });
    if ( !todo )  res.status(404).json({ error: `Todo with id ${ id } not found` });
    const deleted = await prisma.todo.delete({
      where: {id}
    });
    ( deleted)
      ? res.json(deleted)
      : res.json(400).json({error: `TODO with id ${id} not found`});
      
    res.json( {todo, deleted} );

  };
}