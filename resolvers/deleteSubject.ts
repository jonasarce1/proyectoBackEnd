// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { SubjectModel } from "../db/subject.ts";

//Record<string, never> es para indicar que no hay ningun parametro en el request, porque Record<string, never> es un objeto vacio
export const deleteSubject = async (req: Request<{ id: string }>, res: Response<string | { error: unknown }>) => {
  try{
    const id = req.params.id;
    const subject = await SubjectModel.findByIdAndDelete(id).exec();
    if (!subject) {
      res.status(404).send({ error: "Subject not found" });
      return;
    }
    res.status(200).send("Subject deleted");
  }catch(error){
    res.status(500).send(error.message);
  }
};
