// @deno-types="npm:@types/express@4" // Necesario para que deno pueda usar express
import express, { Request, Response } from "express"; //Podemos importar debido al json y a los settings de deno import map => ./deno.json
import mongoose from "mongoose";

//En deno.json --env hace que se pueda usar las variables de entorno directamente en el codigo

import { postSubject } from "./resolvers/postSubject.ts";
import { putSubject } from "./resolvers/putSubject.ts";
import { deleteSubject } from "./resolvers/deleteSubject.ts";
import { getSubjects } from "./resolvers/getSubjects.ts";
import { getSubject } from "./resolvers/getSubject.ts";

import { getTeachers } from "./resolvers/getTeachers.ts";
import { getTeacher } from "./resolvers/getTeacher.ts";
import { postTeacher } from "./resolvers/postTeacher.ts";
import { deleteTeacher } from "./resolvers/deleteTeacher.ts";
import { putTeacher } from "./resolvers/putTeacher.ts";


import { getStudents } from "./resolvers/getStudents.ts";
import { getStudent } from "./resolvers/getStudent.ts";
import { postStudent } from "./resolvers/postStudent.ts";
import { putStudent } from "./resolvers/putStudent.ts";
import { deleteStudent } from "./resolvers/deleteStudent.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
export const app = express(); //Exportamos app para poder usarla en los tests
app.use(express.json());
app
  .get("/teachers", getTeachers) //Devuelve todos los profesores
  .get("/students", getStudents) //Devuelve todos los estudiantes
  .get("/subjects", getSubjects) //Devuelve todas las asignaturas
  .get("/teacher/:id", getTeacher) //Devuelve un profesor por su id
  .get("/student/:id", getStudent) //Devuelve un estudiante por su id
  .get("/subject/:id", getSubject) //Devuelve una asignatura por su id
  .post("/teacher", postTeacher) //Crea un profesor a partir de nombre y email
  .post("/student", postStudent) //Crea un estudiante a partir de nombre y email
  .post("/subject", postSubject) //Crea una asignatura a partir de nombre, id del profesor, array de ids de estudiantes y anyo
  .put("/teacher/:id", putTeacher) //Actualiza un profesor a partir de su id, solo permite actualizar nombre y email
  .put("/student/:id", putStudent) //Actualiza un estudiante a partir de su id, solo permite actualizar nombre y email
  .put("/subject/:id", putSubject) //Actualiza una asignatura a partir de su id, permite actualizar nombre, id del profesor, array de ids de estudiantes y anyo
  .delete("/teacher/:id", deleteTeacher) //Elimina un profesor a partir de su id
  .delete("/student/:id", deleteStudent) //Elimina un estudiante a partir de su id
  .delete("/subject/:id", deleteSubject) //Elimina una asignatura a partir de su id

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

