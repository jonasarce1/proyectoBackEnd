// @deno-types="npm:@types/express@4"
import { Request, Response} from "express";
import { Subject } from "../types.ts";

import { SubjectModel } from "../db/subject.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

export const getSubject = async (req: Request<{ id: string }>, res: Response<Subject | { error: unknown }>) => { //En request estoy tipando los parametros que recibo, en este caso solo id
  try {
    const id = req.params.id; //En request.params estan los parametros que recibo
    const subject = await SubjectModel.findById(id).exec(); //en subject no hay un Subject sino un SubjectModelType

    if (!subject) {
      res.status(404).send({ error: "Subject not found" });
      return;
    }

    //No hace falta comprobar si existe el teacher asociado a la asignatura porque en el modelo de asignatura ya lo hemos hecho

    const subjectResponse: Subject = await getSubjectFromModel(subject); 

    //getSubjectFromModel devuelve un Subject (o promesa de Subject) a partir de un SubjectModelType, esta funcion esta en controllers
    //Hacemos eso ya que hemos tipado el response como Subject o {error: unknown}

    res.status(200).json(subjectResponse).send(); //Lo mandamos en .json porque lo hemos tipado en el response
  } catch (error) {
    res.status(500).send(error);
  }
};
