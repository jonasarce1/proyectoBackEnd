import mongoose from "mongoose";
import { Teacher } from "../types.ts";
import { SubjectModel } from "./subject.ts";

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

//Validate email
teacherSchema.path("email").validate((email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Expresion regular para validar el email, esto indica que el email tiene que tener un @ y un .
  return emailRegex.test(email);
});

//Middleware hook para eliminar las asociaciones de las asignaturas cuando se elimina un profesor
teacherSchema.post("findOneAndDelete", async function (teacher: TeacherModelType) {
  try {
    await SubjectModel.updateMany(
      { teacherID: teacher._id }, //Busco las asignaturas que tengan el id del profesor que se ha eliminado
      { teacherID: null } //Elimino el id del profesor de las asignaturas
    );
  } catch (e) {
    console.log(e.error);
  }
});

/*//Middleware hook para eliminar las asignaturas cuando se elimina un profesor
teacherSchema.post("findOneAndDelete", async function (teacher: TeacherModelType) {
  try {
    await SubjectModel.deleteMany(
      { teacherID: teacher._id }, //Busco las asignaturas que tengan el id del profesor que se ha eliminado
    );
  } catch (e) {
    console.log(e.error);
  }
});*/

export type TeacherModelType = mongoose.Document &
  Omit<Teacher, "id" | "subjects">;

export const TeacherModel = mongoose.model<TeacherModelType>("Teacher", teacherSchema);
