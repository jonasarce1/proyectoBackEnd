// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Teacher } from "../types.ts";
import { TeacherModel, TeacherModelType } from "../db/teacher.ts";
import { getTeacherFromModel } from "../controllers/getTeacherFromModel.ts";

export const putTeacher = async (req: Request<{ id: string }, {}, TeacherModelType>, res: Response<Teacher | { error: unknown }>) => {
    try {
        const id = req.params.id;
        const { name, email } = req.body;

        const teacher = await TeacherModel.findByIdAndUpdate(id, { //Recordar Middleware Hook para cuando se actualiza un teacher
            name,
            email
        }, { new: true, runValidators: true}).exec(); //new:true devuelve el objeto actualizado, runValidators:true ejecuta las validaciones del modelo

        if (!teacher) {
            res.status(404).send({ error: "Teacher not found" });
            return;
        }
        const teacherResponse: Teacher = await getTeacherFromModel(teacher);
        res.status(200).json(teacherResponse).send();
    } catch (error) {
        res.status(500).send(error);
    }
};