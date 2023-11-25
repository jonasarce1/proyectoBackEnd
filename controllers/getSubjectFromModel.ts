import { SubjectModelType } from "../db/subject.ts";
import { StudentModel } from "../db/student.ts";
import { TeacherModel } from "../db/teacher.ts";
import { Subject } from "../types.ts";

//Esta funcion devuelve un Subject a partir de un SubjectModelType (que es lo que devuelve mongoose)
export const getSubjectFromModel = async (subject: SubjectModelType): Promise<Subject> => {
  const { _id, name, year, teacherID, studentsID } = subject; //Sacamos los campos del subject

  const teacher = await TeacherModel.findById(teacherID);
  if (!teacher) throw new Error("Teacher not found"); //Comprobamos que exista el teacher asociado a la asignatura

  const students = await StudentModel.find({ _id: { $in: studentsID } }); //Buscamos los ids de estudiantes que esten en el array de studentsID
  //$in es un operador de mongoose que busca en un array de ids, en este caso busca los estudiantes que esten en el array de studentsID (dids de los estudiantes asociados a la asignatura)


  const subjectResponse: Subject = { //Creamos un Subject con los campos que queremos en el response
    id: _id.toString(), //Id de la asignatura, _id es de mongoose y es un objeto, lo pasamos a string, este id se omitira en el response
    name,
    year,
    teacher: {
      id: teacher._id.toString(), //Id del profesor asociado a la asignatura
      name: teacher.name,
      email: teacher.email,
    },
    students: students.map((student) => ({ //Array de estudiantes asociados a la asignatura, hay que mapearlos para sacar los campos que queremos
      id: student._id.toString(), //Ids de los estudiantes asociados a la asignatura
      name: student.name,
      email: student.email,
    })),
  };

  return subjectResponse;
};
