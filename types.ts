export type Teacher = {
  id: string;
  name: string;
  email: string;
  subjects: Array<Omit<Subject, "teacher" | "students">>; //Array de subjects sin el teacher y sin students
};

export type Subject = {
  id: string;
  name: string;
  year: string;
  teacher: Omit<Teacher, "subjects">; //Tipo teacher sin las asignaturas
  students: Array<Omit<Student, "subjects">>;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  subjects: Array<Omit<Subject, "students" | "teacher">>; //Array de subjects sin los students y sin teachers
};
