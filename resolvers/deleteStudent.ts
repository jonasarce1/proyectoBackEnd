// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { StudentModel} from "../db/student.ts";
import { Student } from "../types.ts";
import { getStudentFromModel } from "../controllers/getStudentFromModel.ts";

export const deleteStudent = async (req: Request<{id:string}>, res: Response<Student| { error: unknown }>) => {
    try{
        const id = req.params.id;

        const student = await StudentModel.findByIdAndDelete(id).exec();

        if(!student){
            res.status(404).send({error:"Student not found"});
            return;
        }

        const studentResponse:Student = await getStudentFromModel(student);

        res.status(200).json(studentResponse).send(); //Devuelvo el estudiante borrado para los tests de Deno
    }catch(error){
        res.status(500).send(error.message);
    }
}