// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { StudentModel, StudentModelType} from "../db/student.ts";
import { Student } from "../types.ts";
import { getStudentFromModel } from "../controllers/getStudentFromModel.ts";

export const putStudent = async (req: Request<{id:string}, {}, StudentModelType>, res: Response<Student| { error: unknown }>) => {
    try{
        const id = req.params.id;
        const {name, email} = req.body;

        const student = await StudentModel.findByIdAndUpdate(id, {
            name,
            email
        }, {new:true}).exec();

        if(!student){
            res.status(404).send({error:"Student not found"});
            return;
        }

        const studentResponse:Student = await getStudentFromModel(student);

        res.status(200).json(studentResponse).send();
    }catch(error){
        res.status(500).send(error.message);
    }
}