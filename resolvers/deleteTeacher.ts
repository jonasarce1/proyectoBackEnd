// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { TeacherModel } from "../db/teacher.ts";
import { Teacher } from "../types.ts";
import { getTeacherFromModel } from "../controllers/getTeacherFromModel.ts";

export const deleteTeacher = async (req:Request<{id : string}>, res:Response<Teacher | {error : unknown}>) => {
    try{
        const id = req.params.id;
        const teacher = await TeacherModel.findByIdAndDelete(id).exec();
        if(!teacher){
            res.status(404).send({error : "Teacher not found"});
            return;
        }
        
        const teacherResponse:Teacher = await getTeacherFromModel(teacher);

        res.status(200).json(teacherResponse).send();
    }catch(error){
        res.status(500).send(error.message);
    }
}