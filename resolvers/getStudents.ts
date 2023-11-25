// @deno-types="npm:@types/express@4"
import { Request, Response} from "express";

import { StudentModel } from "../db/student.ts";
import { Student } from "../types.ts";
import { getStudentFromModel } from "../controllers/getStudentFromModel.ts";

export const getStudents = async (_req:Request, res:Response<Array<Student> | {error:unknown}>) => {
    try{
        const students = await StudentModel.find({}).exec();
        const studentsResponse:Student[]= await Promise.all(students.map(async (student) => await getStudentFromModel(student)));
        res.status(200).json(studentsResponse).send();
    }catch(error){
        res.status(500).send(error.message);
    }
}