import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

// LA arquitectura actual del controlador es DDD (Domain Driven Design),
// por lo que el controlador no depende directamente de Prisma,
// sino que utiliza un repositorio que abstrae el acceso a los datos.
export class TodosController {

  constructor(
    private readonly todoRepository: TodoRepository,
  ) {}

  public getTodos = async (req: Request, res: Response) => {
    // Actualmente utilizamos Prisma directamente aquí
    //const todos = await prisma.todo.findMany();

    // En su lugar puedo usar el repositorio que hemos creado para la abstraccion.
    const todos = await this.todoRepository.getAll();
    res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    // Realizamos la validacion del ID
    // if (isNaN(id)) {
    //   res.status(400).json({ error: 'ID argument is not a number' });
    //   return;
    // }
    // Utilizamos el repositorio directamente para obtener el TODO por ID
    // const todo = await prisma.todo.findFirst({
    //   where: { id }
    // });
    // if (!todo) {
    //   res.status(404).json({ error: `TODO with id ${id} not found` });
    //   return;
    // }
    // res.json(todo);

    // Vamos a abstraer rl acceso al repositorio con una validadion try catch
    try {
      const todo = await this.todoRepository.findById(id);
      res.json(todo);
    } catch (error) {
      res.status(400).json({ error: `TODO with id ${id} not found`});
    }
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    // Validamos si hubo un error al crear el DTO
    if (error) return res.status(400).json({ error });
    // Utilizo prima para crear el TODO
    // const todo = await prisma.todo.create({
    //   data: createTodoDto!
    // });
    // res.json(todo);

    // En su lugar puedo usar el repositorio que hemos creado para la abstraccion
    const todo = await this.todoRepository.create(createTodoDto!);
    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    const updateTodo = await this.todoRepository.updateById(updateTodoDto!);
    return res.json(updateTodo)
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const deletedTodo = await this.todoRepository.deleteById(id);
    return res.json(deletedTodo);
  };
}