import { TeacherModelType } from "../db/teacher.ts";
import { SubjectModel } from "../db/subject.ts";
import { Teacher } from "../types.ts";

export const getTeacherFromModel = async (teacher: TeacherModelType): Promise<Teacher> => {
    const { _id, name, email } = teacher;

    const subjects = await SubjectModel.find({ teacherID: _id });

    const teacherResponse: Teacher = {
        id: _id.toString(),
        name,
        email,
        subjects: subjects.map((subject) => ({
            id: subject._id.toString(), //Id de la asignatura, este id se omitira en el response
            name: subject.name,
            year: subject.year,
        })),
    };

    return teacherResponse;
};