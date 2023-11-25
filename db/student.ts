import mongoose from "mongoose";
import { Student } from "../types.ts";
import { SubjectModel } from "./subject.ts";

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

//Validate email
studentSchema.path("email").validate((email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Expresion regular para validar el email, esto indica que el email tiene que tener un @ y un .
  return emailRegex.test(email);
});

//Middleware hook para eliminar las asociaciones de las asignaturas cuando se elimina un estudiante
studentSchema.post("findOneAndDelete", async function (student: StudentModelType) {
  try {
    await SubjectModel.updateMany(
      { studentsID: student._id }, //Busco las asignaturas que tengan el id del estudiante que se ha eliminado
      { $pull: { studentsID: student._id } } //Elimino el id del estudiante de las asignaturas
    );
  } catch (e) {
    console.log(e.error);
  }
});

export type StudentModelType = mongoose.Document &
  Omit<Student, "id" | "subjects">;

export const StudentModel = mongoose.model<StudentModelType>(
  "Student",
  studentSchema
);

