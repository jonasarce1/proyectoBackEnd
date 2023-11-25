// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Subject } from "../types.ts";

import { SubjectModel } from "../db/subject.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

export const getSubjects = async (_req: Request, res: Response<Subject[] | { error: unknown }>) => { //Hay tres campos en el request: params, body y query
  //En Response estoy tipando lo que voy a devolver, en este caso un array de Subject o un objeto con un error
  try {
    const subjects = await SubjectModel.find({}).exec();
    const subjectsResponse: Subject[] = await Promise.all( //Promise.all ejecuta todas las promesas que le pasemos y devuelve un array con los resultados
      subjects.map((subject) => getSubjectFromModel(subject))
    );
    res.status(200).json(subjectsResponse).send(); //En response.status estoy tipando el codigo de respuesta .json es para devolver un json y .send() para enviarlo
    //devolvemos mediante .json el array de subjectsResponse porque en el response hemos tipado que devolvemos un array de Subject
  } catch (error) {
    res.status(500).send(error.message);
  }
};
