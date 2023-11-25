// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { SubjectModel } from "../db/subject.ts";
import { Subject } from "../types.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

//Record<string, never> es para indicar que no hay ningun parametro en el request, porque Record<string, never> es un objeto vacio
export const deleteSubject = async (req: Request<{ id: string }>, res: Response<Subject | { error: unknown }>) => {
  try{
    const id = req.params.id;
    const subject = await SubjectModel.findByIdAndDelete(id).exec();
    if (!subject) {
      res.status(404).send({ error: "Subject not found" });
      return;
    }

    const subjectResponse: Subject = await getSubjectFromModel(subject);
    
    res.status(200).json(subjectResponse).send();
  }catch(error){
    res.status(500).send(error.message);
  }
};
