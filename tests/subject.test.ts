import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.203.0/assert/mod.ts";
import { Subject } from "../types.ts";

//Funcion auxiliar para crear una asignatura de prueba
async function createSubject(){
    //Creamos un profesor
    const teacher = {
        name: "Teacher1",
        email: "emailteacher1@mail.com"
    }

    const createTeacherResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(teacher) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
    });

    const teacherResult = await createTeacherResponse.json();

    //Cogemos el id del profesor creado
    const teacherID = teacherResult.id;

    //Creamos varios estudiantes

    const student1 = {
        name: "Student1",
        email: "emailstudent1@mail.com"
    }

    const student2 = {
        name: "Student2",
        email: "emailstudent2@mail.com"
    }

    const createStudentResponse1 = await fetch("https://proyecto-backend.deno.dev/student", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student1)
    });

    const createStudentResponse2 = await fetch("https://proyecto-backend.deno.dev/student", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student2)
    });

    const studentResult1 = await createStudentResponse1.json();
    const studentResult2 = await createStudentResponse2.json();

    //Cogemos los ids de los estudiantes creados
    const studentID1 = studentResult1.id;
    const studentID2 = studentResult2.id;

    //Creamos una asignatura, la asociamos al profesor creado y a los estudiantes creados
    const subject = {
        name: "Subject1",
        teacherID: teacherID, //Ha de ser estrictamente teacherID debido a que en el modelo de la BBDD se llama asi, lo mismo con studentsID
        year: 1,
        studentsID: [studentID1, studentID2]
    }

    const createSubjectResponse = await fetch("https://proyecto-backend.deno.dev/subject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subject) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
    });

    const subjectResult = await createSubjectResponse.json();

    return subjectResult;
}

//Funcion auxiliar para borrar una asignatura de prueba
async function deleteSubject(subjectID: string, studentID1: string, studentID2: string, teacherID: string){
    //Borramos la asignatura creada
    const deleteSubjectResponse = await fetch(`https://proyecto-backend.deno.dev/subject/${subjectID}`, {
        method: "DELETE"
    });

    //Borramos los estudiantes creados
    const deleteStudentResponse1 = await fetch(`https://proyecto-backend.deno.dev/student/${studentID1}`, {
        method: "DELETE"
    });

    const deleteStudentResponse2 = await fetch(`https://proyecto-backend.deno.dev/student/${studentID2}`, {
        method: "DELETE"
    });

    //Borramos el profesor creado
    const deleteTeacherResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${teacherID}`, {
        method: "DELETE"
    });

    await deleteSubjectResponse.text(); //Hay que consumir el cuerpo de la respuesta para que la conexion se cierre
    await deleteStudentResponse1.text();
    await deleteStudentResponse2.text();
    await deleteTeacherResponse.text();

    return;
}

//Test postSubject
Deno.test({
    name: "postSubject",
    async fn() {
        try{
            //Creamos un profesor
            const teacher = {
                name: "Teacher1",
                email: "emailteacher1@mail.com"
            }

            const createTeacherResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(teacher) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
            });

            const teacherResult = await createTeacherResponse.json();

            //Cogemos el id del profesor creado
            const teacherID = teacherResult.id;

            //Creamos varios estudiantes

            const student1 = {
                name: "Student1",
                email: "emailstudent1@mail.com"
            }

            const student2 = {
                name: "Student2",
                email: "emailstudent2@mail.com"
            }

            const createStudentResponse1 = await fetch("https://proyecto-backend.deno.dev/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student1)
            });

            const createStudentResponse2 = await fetch("https://proyecto-backend.deno.dev/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student2)
            });

            const studentResult1 = await createStudentResponse1.json();
            const studentResult2 = await createStudentResponse2.json();

            //Cogemos los ids de los estudiantes creados
            const studentID1 = studentResult1.id;
            const studentID2 = studentResult2.id;

            //Creamos una asignatura, la asociamos al profesor creado y a los estudiantes creados
            const subject = {
                name: "Subject1",
                teacherID: teacherID, //Ha de ser estrictamente teacherID debido a que en el modelo de la BBDD se llama asi, lo mismo con studentsID
                year: 1,
                studentsID: [studentID1, studentID2]
            }

            const createSubjectResponse = await fetch("https://proyecto-backend.deno.dev/subject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(subject) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
            });

            const subjectResult = await createSubjectResponse.json();

            assertEquals(subjectResult.name, subject.name);
            assertEquals(subjectResult.teacher.id, subject.teacherID); //Aqui en el result se accede a teacher pero no a teacherID, ya que subjectResult es un Subject y no un SubjectModelType
            assertEquals(subjectResult.students[0].id, subject.studentsID[0]);
            assertEquals(subjectResult.students[1].id, subject.studentsID[1]);

            //Borramos la asignatura, los profesores y los estudiantes creados
            await deleteSubject(subjectResult.id, studentID1, studentID2, teacherID);
        }catch(e){
            console.log(e.message);
        }    
    }
});

//Test getSubject
Deno.test({
    name: "getSubject",
    async fn() {
        //Creamos un profesor
        const teacher = {
            name: "Teacher1",
            email: "emailteacher1@mail.com"
        }

        const createTeacherResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });

        const teacherResult = await createTeacherResponse.json();

        //Cogemos el id del profesor creado
        const teacherID = teacherResult.id;

        //Creamos varios estudiantes

        const student1 = {
            name: "Student1",
            email: "emailstudent1@mail.com"
        }

        const student2 = {
            name: "Student2",
            email: "emailstudent2@mail.com"
        }

        const createStudentResponse1 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student1)
        });

        const createStudentResponse2 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student2)
        });

        const studentResult1 = await createStudentResponse1.json();
        const studentResult2 = await createStudentResponse2.json();

        //Cogemos los ids de los estudiantes creados
        const studentID1 = studentResult1.id;
        const studentID2 = studentResult2.id;

        //Creamos una asignatura, la asociamos al profesor creado y a los estudiantes creados
        const subject = {
            name: "Subject1",
            teacherID: teacherID, //Ha de ser estrictamente teacherID debido a que en el modelo de la BBDD se llama asi, lo mismo con studentsID
            year: 1,
            studentsID: [studentID1, studentID2]
        }

        const createSubjectResponse = await fetch("https://proyecto-backend.deno.dev/subject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subject) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });

        const subjectResult = await createSubjectResponse.json();

        //Cogemos la asignatura creada
        const getSubjectResponse = await fetch(`https://proyecto-backend.deno.dev/subject/${subjectResult.id}`, {
            method: "GET"
        });

        const getSubjectResult = await getSubjectResponse.json();

        assertEquals(getSubjectResult.name, subject.name);
        assertEquals(getSubjectResult.teacher.id, subject.teacherID); 
        assertEquals(getSubjectResult.students[0].id, subject.studentsID[0]);
        assertEquals(getSubjectResult.students[1].id, subject.studentsID[1]);

        //Borramos la asignatura creada y los profesores y estudiantes creados
        await deleteSubject(subjectResult.id, studentID1, studentID2, teacherID);
    }
});

//Test getSubjects
Deno.test({
    name: "getSubjects",
    async fn() {
        //Creamos una asignatura de prueba
        const subject = await createSubject();

        //Cogemos todas las asignaturas
        const getSubjectsResponse = await fetch("https://proyecto-backend.deno.dev/subjects", {
            method: "GET"
        });

        const getSubjectsResult = await getSubjectsResponse.json();

        //Comprobamos que la asignatura de prueba esta entre las asignaturas
        getSubjectsResult.find((subjectResult: Subject) => {
            if(subjectResult.id == subject.id){
                assertEquals(subjectResult.name, subject.name);
                assertEquals(subjectResult.teacher.id, subject.teacher.id); 
                assertEquals(subjectResult.students[0].id, subject.students[0].id);
                assertEquals(subjectResult.students[1].id, subject.students[1].id);
            }
        });

        //Borramos la asignatura creada y los profesores y estudiantes creados
        await deleteSubject(subject.id, subject.students[0].id, subject.students[1].id, subject.teacher.id);
    }
});

//Test putSubject y middleware hooks al actualizar subject
Deno.test({
    name: "putSubject/middleware hooks",
    async fn() {
        //Creamos una asignatura con profesor y estudiantes de prueba
        
        //Creamos un profesor
        const teacherAntiguo = {
            name: "Teacher1",
            email: "mailteacher1@mail.com"
        }

        const createTeacherResponseAntiguo = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacherAntiguo) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });

        //Creamos unos estudiantes antiguos
        const studentAntiguo1 = {
            name: "Student1",
            email: "mailstudent1@mail.com"
        }

        const studentAntiguo2 = {
            name: "Student2",
            email: "mailstudent2@mail.com"
        }

        const createStudentResponseAntiguo1 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentAntiguo1)
        });

        const createStudentResponseAntiguo2 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentAntiguo2)
        });

        const teacherResultAntiguo = await createTeacherResponseAntiguo.json();
        const studentResultAntiguo1 = await createStudentResponseAntiguo1.json();
        const studentResultAntiguo2 = await createStudentResponseAntiguo2.json();

        //Cogemos los ids del profesor y estudiantes creados
        const teacherIDAntiguo = teacherResultAntiguo.id;
        const studentIDAntiguo1 = studentResultAntiguo1.id;
        const studentIDAntiguo2 = studentResultAntiguo2.id;

        //Creamos una asignatura de prueba
        const subjectAntiguo = {
            name: "Subject1",
            teacherID: teacherIDAntiguo,
            year: 1,
            studentsID: [studentIDAntiguo1, studentIDAntiguo2]
        }

        const createSubjectResponseAntiguo = await fetch("https://proyecto-backend.deno.dev/subject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subjectAntiguo) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });

        const subjectResultAntiguo = await createSubjectResponseAntiguo.json();

        //Creamos un profesor para actualizar
        const teacherNuevo = {
            name: "Teacher2",
            email: "mailteacher2@mail.com"
        }

        const createTeacherResponseNuevo = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacherNuevo) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });

        const teacherResultNuevo = await createTeacherResponseNuevo.json();

        //Cogemos el id del profesor creado
        const teacherID = teacherResultNuevo.id;

        //Creamos varios estudiantes nuevos para actualizar
        const studentNuevo1 = {
            name: "Student3",
            email: "mailstudent3@mail.com"
        }

        const studentNuevo2 = {
            name: "Student4",
            email: "mailstudent4@mail.com"
        }

        const createStudentResponseNuevo1 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentNuevo1)
        });

        const createStudentResponseNuevo2 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentNuevo2)
        });

        const studentResult1 = await createStudentResponseNuevo1.json();
        const studentResult2 = await createStudentResponseNuevo2.json();

        //Cogemos los ids de los estudiantes creados
        const studentID1 = studentResult1.id;
        const studentID2 = studentResult2.id;

        //Actualizamos la asignatura de prueba
        const putSubjectResponse = await fetch(`https://proyecto-backend.deno.dev/subject/${subjectResultAntiguo.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ //Actualizamos la asignatura con los datos del profesor y estudiantes creados y otro anyo
                name: "Subject2",
                teacherID: teacherID,
                year: 2,
                studentsID: [studentID1, studentID2]
            })
        });

        const putSubjectResult = await putSubjectResponse.json();

        //Comprobamos que la asignatura se ha actualizado correctamente
        assertEquals(putSubjectResult.name, "Subject2");
        assertEquals(putSubjectResult.teacher.id, teacherID);
        assertEquals(putSubjectResult.students[0].id, studentID1);
        assertEquals(putSubjectResult.students[1].id, studentID2);
        assertEquals(putSubjectResult.year, 2);


        //Comprobamos los middleware hooks de que se han actualizado los ids de la asignatura en los profesores y estudiantes
        //Cogemos el profesor
        const getTeacherResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${teacherID}`, {
            method: "GET"
        });

        const getTeacherResult = await getTeacherResponse.json();

        //Cogemos los estudiantes
        const getStudentResponse1 = await fetch(`https://proyecto-backend.deno.dev/student/${studentID1}`, {
            method: "GET"
        });

        const getStudentResponse2 = await fetch(`https://proyecto-backend.deno.dev/student/${studentID2}`, {
            method: "GET"
        });

        const getStudentResult1 = await getStudentResponse1.json();
        const getStudentResult2 = await getStudentResponse2.json();

        //Comprobamos que se ha actualizado el id de la asignatura en el profesor y estudiantes
        assertEquals(getTeacherResult.subjects[0].id, putSubjectResult.id);
        assertEquals(getStudentResult1.subjects[0].id, putSubjectResult.id);
        assertEquals(getStudentResult2.subjects[0].id, putSubjectResult.id);

        //Borramos la asignatura creada y los profesores y estudiantes creados
        await deleteSubject(putSubjectResult.id, putSubjectResult.students[0].id, putSubjectResult.students[1].id, putSubjectResult.teacher.id);
        //Borramos los profesores y estudiantes antiguos
        await deleteSubject(subjectResultAntiguo.id, studentIDAntiguo1, studentIDAntiguo2, teacherIDAntiguo);
    }
});

//Test deleteSubject y middleware hooks al borrar subject
Deno.test({
    name: "deleteSubject/middleware hooks",
    async fn() {
        //Creamos una asignatura con profesor y estudiantes de prueba
        
        //Creamos un profesor
        const teacher = {
            name: "Teacher1",
            email: "mailteacher1@mail.com"
        }

        const createTeacherResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });

        //Creamos unos estudiantes
        const student1 = {
            name: "Student1",
            email: "mailstudent1@mail.com"
        }

        const student2 = {
            name: "Student2",
            email: "mailstudent2@mail.com"
        }

        const createStudentResponse1 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student1)
        });

        const createStudentResponse2 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student2)
        });

        const teacherResult = await createTeacherResponse.json();

        const studentResult1 = await createStudentResponse1.json();

        const studentResult2 = await createStudentResponse2.json();

        //Cogemos los ids del profesor y estudiantes creados
        const teacherID = teacherResult.id;

        const studentID1 = studentResult1.id;

        const studentID2 = studentResult2.id;

        //Creamos una asignatura de prueba

        const subject = {
            name: "Subject1",
            teacherID: teacherID,
            year: 1,
            studentsID: [studentID1, studentID2]
        }

        const createSubjectResponse = await fetch("https://proyecto-backend.deno.dev/subject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subject) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });

        const subjectResult = await createSubjectResponse.json();

        //Borramos la asignatura creada

        const deleteSubjectResponse = await fetch(`https://proyecto-backend.deno.dev/subject/${subjectResult.id}`, {
            method: "DELETE"
        });

        const deleteSubjectResult = await deleteSubjectResponse.json();

        //Comprobamos que la asignatura se ha borrado correctamente
        assertEquals(deleteSubjectResult.id, subjectResult.id);

        //Comprobamos los middleware hooks de que se han borrado los ids de la asignatura en los profesores y estudiantes

        //Cogemos el profesor
        const getTeacherResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${teacherID}`, {
            method: "GET"
        });

        const getTeacherResult = await getTeacherResponse.json();

        //Cogemos los estudiantes
        const getStudentResponse1 = await fetch(`https://proyecto-backend.deno.dev/student/${studentID1}`, {
            method: "GET"
        });

        const getStudentResponse2 = await fetch(`https://proyecto-backend.deno.dev/student/${studentID2}`, {
            method: "GET"
        });

        const getStudentResult1 = await getStudentResponse1.json();
        const getStudentResult2 = await getStudentResponse2.json();

        //Comprobamos que se ha borrado el id de la asignatura en el profesor y estudiantes
        assertEquals(getTeacherResult.subjects.length, 0);
        assertEquals(getStudentResult1.subjects.length, 0);
        assertEquals(getStudentResult2.subjects.length, 0);

        //Borramos los profesores y estudiantes creados
        await deleteSubject(subjectResult.id, studentID1, studentID2, teacherID);
    }
});