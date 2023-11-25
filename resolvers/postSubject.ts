// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Subject } from "../types.ts";

import { SubjectModel, SubjectModelType } from "../db/subject.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

export const postSubject = async (req: Request<{}, {}, SubjectModelType>, res: Response<Subject | { error: unknown }>) => { 
  //Record<string, never> es para indicar que no hay ningun parametro en el request, ya que con {} aparecia un warning, pero esto me da error en el main
  try {
    //Hay tres campos en el request: params, body y query, indicando SubjectModelType en el body, estamos tipando el body
    const { name, teacherID, studentsID, year } = req.body;
    const subject = new SubjectModel({ //Se crea un nuevo objeto de tipo SubjectModelType
      name,
      year,
      teacherID,
      studentsID,
    });
    await subject.save();

    const subjectResponse: Subject = await getSubjectFromModel(subject); //getSubjectFromModel devuelve un Subject (o promesa de Subject) a partir de un SubjectModelType

    res.status(201).json(subjectResponse).send(); //Da lo mismo poner .json() o directamente .send() ya que express sabe que es un json
  } catch (error) {
    res.status(500).send(error);
  }
};
