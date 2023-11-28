import { SubjectModelType } from "../db/subject.ts";
import { StudentModel } from "../db/student.ts";
import { TeacherModel } from "../db/teacher.ts";
import { Subject } from "../types.ts";

//Esta funcion devuelve un Subject a partir de un SubjectModelType (que es lo que devuelve mongoose)
export const getSubjectFromModel = async (subject: SubjectModelType): Promise<Subject> => {
  const { _id, name, year, teacherID, studentsID } = subject; //Sacamos los campos del subject

  const teacher = await TeacherModel.findById(teacherID); //Buscamos el profesor asociado a la asignatura

  const students = await StudentModel.find({ _id: { $in: studentsID } }); //Buscamos los ids de estudiantes que esten en el array de studentsID
  //$in es un operador de mongoose que busca en un array de ids, en este caso busca los estudiantes que esten en el array de studentsID (dids de los estudiantes asociados a la asignatura)

  if(!teacher && students.length === 0){ //Si no hay profesor asociado a la asignatura y no hay estudiantes asociados a la asignatura
    const subjectResponse: Subject = { //Creamos un Subject con los campos que queremos en el response
      id: _id.toString(), //Id de la asignatura, _id es de mongoose y es un objeto, lo pasamos a string, este id se omitira en el response
      name,
      year,
      teacher: {
        id: "",
        name: "",
        email: ""
      }, //Si no hay profesor asociado a la asignatura ponemos null
      students: [], //Si no hay estudiantes asociados a la asignatura ponemos un array vacio
    };
    return subjectResponse;
  }

  if(!teacher){ //Si no hay profesor asociado a la asignatura pero hay estudiantes
    const subjectResponse: Subject = { //Creamos un Subject con los campos que queremos en el response
      id: _id.toString(), //Id de la asignatura, _id es de mongoose y es un objeto, lo pasamos a string, este id se omitira en el response
      name,
      year,
      teacher: {
        id: "",
        name: "",
        email: ""
      }, //Si no hay profesor asociado a la asignatura ponemos null
      students: students.map((student) => ({ //Array de estudiantes asociados a la asignatura, hay que mapearlos para sacar los campos que queremos
        id: student._id.toString(), //Ids de los estudiantes asociados a la asignatura
        name: student.name,
        email: student.email,
      })),
    };
    return subjectResponse;
  }

  if(students.length === 0){ //Si no hay estudiantes asociados a la asignatura pero hay profesor
    const subjectResponse: Subject = { //Creamos un Subject con los campos que queremos en el response
      id: _id.toString(), //Id de la asignatura, _id es de mongoose y es un objeto, lo pasamos a string, este id se omitira en el response
      name,
      year,
      teacher: {
        id: teacher._id.toString(), //Id del profesor asociado a la asignatura
        name: teacher.name,
        email: teacher.email,
      },
      students: [], //Si no hay estudiantes asociados a la asignatura ponemos un array vacio
    };
    return subjectResponse;
  }

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
