import { StudentModelType } from "../db/student.ts";
import { SubjectModel } from "../db/subject.ts";
import { Student } from "../types.ts";

export const getStudentFromModel = async (student: StudentModelType): Promise<Student> => {
    const { _id, name, email } = student;

    const subjects = await SubjectModel.find({ studentsID: _id });

    const studentResponse: Student = {
        id: _id.toString(),
        name,
        email,
        subjects: subjects.map((subject) => ({
            id: subject._id.toString(), //Id de la asignatura, este id se omitira en el response
            name: subject.name,
            year: subject.year,
        })),
    };

    return studentResponse;
};