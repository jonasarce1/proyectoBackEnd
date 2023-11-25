// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Teacher } from "../types.ts";
import { TeacherModel } from "../db/teacher.ts";
import { getTeacherFromModel } from "../controllers/getTeacherFromModel.ts";

export const getTeacher = async (req: Request<{ id: string }>, res: Response<Teacher | { error: unknown }>) => {
  //Request<{ id: string }> es para tipar los parametros que recibo, en este caso solo id
  try {
    const id = req.params.id;
    const teacher = await TeacherModel.findById(id).exec();

    if (!teacher) {
      res.status(404).send({ error: "Teacher not found" });
      return;
    }

    const teacherResponse: Teacher = await getTeacherFromModel(teacher);
    //getTeacherFromModel devuelve un Teacher (o promesa de Teacher) a partir de un TeacherModelType, esta funcion esta en controllers

    res.status(200).json(teacherResponse).send();
  } catch (error) {
    res.status(500).send(error);
  }
}