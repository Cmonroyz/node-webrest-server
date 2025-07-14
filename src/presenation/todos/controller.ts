import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

export class TodosController {

  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID argument is not a number' });
      return;
    }

    const todo = await prisma.todo.findFirst({
      where: { id }
    });

    if (!todo) {
      res.status(404).json({ error: `TODO with id ${id} not found` });
      return;
    }

    res.json(todo);
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });
    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const todo = await prisma.todo.findFirst({
      where: { id }
    });
    if (!todo) {
      res.status(404).json({ error: `Todo with id ${id} not found` });
      return;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateTodoDto!.values
    });
    res.json(updatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const todo = await prisma.todo.findFirst({
      where: { id }
    });
    if (!todo) {
      res.status(404).json({ error: `Todo with id ${id} not found` });
      return;
    }

    const deleted = await prisma.todo.delete({
      where: { id }
    });
    res.json(deleted);
  };
}