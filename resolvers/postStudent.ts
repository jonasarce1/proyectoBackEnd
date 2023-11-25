// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { StudentModel, StudentModelType} from "../db/student.ts";
import { Student } from "../types.ts";
import { getStudentFromModel } from "../controllers/getStudentFromModel.ts";


export const postStudent = async (req: Request<{}, {}, StudentModelType>, res: Response<Student| { error: unknown }>) => {
    try{
        const {name, email} = req.body;

        const student = new StudentModel({
            name,
            email
        });

        await student.save();

        const studentResponse:Student = await getStudentFromModel(student);

        res.status(201).json(studentResponse).send();
    }catch(error){
        res.status(500).send(error.message);
    }
};
