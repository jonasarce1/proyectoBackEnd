// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { StudentModel} from "../db/student.ts";

export const deleteStudent = async (req: Request<{id:string}>, res: Response<string| { error: unknown }>) => {
    try{
        const id = req.params.id;

        const student = await StudentModel.findByIdAndDelete(id).exec();

        if(!student){
            res.status(404).send({error:"Student not found"});
            return;
        }

        res.status(200).send("Student deleted");
    }catch(error){
        res.status(500).send(error.message);
    }
}