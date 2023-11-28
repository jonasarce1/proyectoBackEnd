import mongoose from "mongoose";
import { Subject } from "../types.ts";
import { TeacherModel } from "./teacher.ts";
import { StudentModel } from "./student.ts";

const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    teacherID: { type: Schema.Types.ObjectId, required: false, ref: "Teacher" }, //ref es para decirle a mongoose que es una referencia a otro modelo
    studentsID: [ //Puedes tener una asignatura sin estudiantes ni profesor
      { type: Schema.Types.ObjectId, required: false, ref: "Student" }, //Schema.types.ObjectId es de mongoose y mongoose.types.ObjectId es de typescript, aqui mejor usar el de Schema
    ],
  },
  { timestamps: true } //timestamps es para que mongoose cree createdAt y updatedAt
);

// validate year
subjectSchema.path("year").validate((year: number) => { //El anyo tiene que ser entre 1 y 4
  return year >= 1 && year <= 4;
}, "Year must be between 1 and 4");

// validate studentsID
subjectSchema
  .path("studentsID")
  .validate(async function (studentIDs: mongoose.Types.ObjectId[]) {
    try {
      if(studentIDs.length === 0) return true; //Si no hay estudiantes mongoose lo permite (porque puede haber una asignatura sin estudiantes
      if (studentIDs.some((id) => !mongoose.isValidObjectId(id))) return false; //Si alguno de los id no es valido mongoose no lo permite
      const students = await StudentModel.find({ _id: { $in: studentIDs } }).exec(); //Si todos los id son validos mongoose busca los estudiantes en la BBDD, $in es para buscar en un array
      return students.length === studentIDs.length; //Si el numero de estudiantes encontrados es igual al numero de id introducidos mongoose lo permite
    } catch (_e) {
      return false;
    }
  });

// validate teacherID
subjectSchema
  .path("teacherID")
  .validate(async function (teacherID: mongoose.Types.ObjectId) { //Valido que el id del profesor exista en la BBDD
    try {
      if(!teacherID) return true; //Si no hay profesor mongoose lo permite (porque puede haber una asignatura sin profesor)
      if (!mongoose.isValidObjectId(teacherID)) return false; //Si el id no es valido mongoose no lo permite
      const teacher = await TeacherModel.findById(teacherID).exec(); 
      if (!teacher) return false; //Si el profesor no existe en la BBDD mongoose no lo permite
      return true;
    } catch (_e) {
      return false;
    }
  });

//Middleware hook para eliminar las asignaturas de los estudiantes cuando se elimina una asignatura 
subjectSchema.post("findOneAndDelete", async function (subject: SubjectModelType) {
  // /findByIdAndDelete/ es una expresion regular para que se ejecute este middleware hook cuando se ejecute un delete
  //usamos findByIdAndDelete ya que es lo que usamos en el resolver deleteSubject
  try {
    await StudentModel.updateMany(
      { subjectsID: subject._id }, //Busco los estudiantes que tengan el id de la asignatura que se ha eliminado
      { $pull: { subjectsID: subject._id } } //Elimino el id de la asignatura de los estudiantes
    );
  } catch (e) {
    console.log(e.message);
  }
})

//Middleware hook para eliminar las asignaturas de los profesores cuando se elimina una asignatura
subjectSchema.post("findOneAndDelete", async function (subject: SubjectModelType) { 
  try {
    await TeacherModel.updateOne(
      { _id: subject.teacherID }, //Busco el profesor que tenga el id de la asignatura que se ha eliminado
      { $pull: { subjectsID: subject._id } } //Elimino el id de la asignatura del profesor
    );
  } catch (e) {
    console.log(e.message);
  }
});

//Middleware hook para que si se actualiza el id del profesor de la asignatura, se cambie el id de la asignatura en el profesor
subjectSchema.post("findOneAndUpdate", async function (subject: SubjectModelType) {
  try {
    await TeacherModel.updateOne(
      { subjectsID: subject._id }, //Busco el profesor que tenga el id de la asignatura que se ha actualizado
      { $pull: { subjectsID: subject._id } } //Elimino el id de la asignatura del profesor
    );
  } catch (e) {
    console.log(e.message);
  }
});

//Middleware hook para que si se actualiza el id del profesor de la asignatura, se cambie el id del profesor de los estudiantes de la asignatura
subjectSchema.post("findOneAndUpdate", async function (subject: SubjectModelType) {
  try {
    await StudentModel.updateMany(
      { subjectsID: subject._id }, //Busco los estudiantes que tengan el id de la asignatura que se ha actualizado
      { $set: { teacherID: subject.teacherID } } //Actualizo el id del profesor de los estudiantes
    );
  } catch (e) {
    console.log(e.message);
  }
});

//Middleware hook para que si se actualizan los ids de los estudiantes de la asignatura, se cambien los ids de la asignatura en los estudiantes
subjectSchema.post("findOneAndUpdate", async function (subject: SubjectModelType) {
  try {
    await StudentModel.updateMany(
      { subjectsID: subject._id }, //Busco los estudiantes que tengan el id de la asignatura que se ha actualizado
      { $pull: { subjectsID: subject._id } } //Elimino el id de la asignatura de los estudiantes
    );
  } catch (e) {
    console.log(e.message);
  }
});

//Exportamos el tipo de modelo de la BBDD
export type SubjectModelType = mongoose.Document & Omit<Subject, "id" | "teacher" | "students"> & {
    teacherID: mongoose.Types.ObjectId; //Esto es para que el id del profesor sea de tipo mongoose.Types.ObjectId
    studentsID: Array<mongoose.Types.ObjectId>; //Esto es para que el id de los estudiantes sea de tipo mongoose.Types.ObjectId
};
//Le quito id, teacher y students. Y le añado teacherID y studentsID que son de tipo mongoose.Types.ObjectId

//Exportamos el modelo de la BBDD
export const SubjectModel = mongoose.model<SubjectModelType>("Subject", subjectSchema); //Exportamos el modelo de la BBDD
