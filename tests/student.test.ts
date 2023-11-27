import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.203.0/assert/mod.ts";

//Test postStudent
Deno.test({
    name: "postStudent",
    async fn() {
        //Creamos un estudiante
        const student = {
            name: "Student1",
            email: "emailfalso1@mail.com"
        }
        
        const createResponse = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" //Esto es necesario para que el servidor sepa que el cuerpo de la peticion es un JSON
            },
            body: JSON.stringify(student) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });
        const result = await createResponse.json();

        assertEquals(result.name, student.name);
        assertEquals(result.email, student.email);

        //Borramos el estudiante creado
        const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/student/${result.id}`, {
            method: "DELETE",
        });

        if (deleteResponse.status === 200) { //Comprobaciones para debuggear
            const result2 = await deleteResponse.json();
            assertEquals(result2.name, student.name);
            assertEquals(result2.email, student.email);
        } else if (deleteResponse.status === 404) {
            const result2 = await deleteResponse.json();
            assertEquals(result2.error, "Student not found");
        } else {
            assertEquals(deleteResponse.status, 500);
            await deleteResponse.text(); //Hay que consumir el cuerpo de la respuesta para que la conexion se cierre
        }
    }
});

//Test getStudents
Deno.test({
    name: "getStudents",
    async fn() {
        //Creamos varios estudiantes
        const student1 = {
            name: "StudentAux1",
            email: "emailAux1@mail.com"
        }
        const student2 = {
            name: "StudentAux2",
            email: "emailAux2@mail.com"
        }

        //Los guardamos en la base de datos
        const createResponse1 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student1)
        });

        const createResponse2 = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student2)
        });

        //Hacemos el get de los estudiantes
        const getResponse = await fetch("https://proyecto-backend.deno.dev/students");
        const result = await getResponse.json();
        assertEquals(Array.isArray(result), true);
        assertEquals(result.length, 2);
        
        //Borramos los estudiantes creados
        const deleteResponse1 = await fetch(`https://proyecto-backend.deno.dev/student/${result[0].id}`, {
            method: "DELETE",
        });

        const deleteResponse2 = await fetch(`https://proyecto-backend.deno.dev/student/${result[1].id}`, {
            method: "DELETE",
        });

        //Hay que consumir los cuerpos de las respuestas para que la conexion se cierre
        await createResponse1.text();
        await createResponse2.text();
        await deleteResponse1.text();
        await deleteResponse2.text();
    }
});

//Test getStudent sin asignaturas
Deno.test({
    name: "getStudent",
    async fn() {
        const student = {
            name: "Student2",
            email: "emailfalso2@mail.com"
        }
        const getResponse = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        //guardo el id del estudiante creado
        const result = await getResponse.json();
        const id = result.id;
        //hago el get del estudiante
        const response2 = await fetch(`https://proyecto-backend.deno.dev/student/${id}`);
        const result2 = await response2.json();
        assertEquals(result2.name, student.name);
        assertEquals(result2.email, student.email);

        //Borramos el estudiante creado
        const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/student/${id}`, {
            method: "DELETE",
        });
        await deleteResponse.text();
    }
});

//Test putStudent
Deno.test({
    name: "putStudent",
    async fn() {
        const student = {
            name: "Student3",
            email: "emailfalso3@mail.com"
        }
        const putResponse = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        //guardo el id del estudiante creado
        const result = await putResponse.json();
        const id = result.id;
        //hago el put del estudiante
        const student2 = {
            name: "Student4",
            email: "nuevoemail@mail.com"
        }
        const response2 = await fetch(`https://proyecto-backend.deno.dev/student/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student2)
        });
        const result2 = await response2.json();
        assertEquals(result2.name, student2.name);
        assertEquals(result2.email, student2.email);

        //Borramos el estudiante creado
        const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/student/${id}`, {
            method: "DELETE",
        });

        await deleteResponse.text();
    }
});

//Test deleteStudent
Deno.test({
    name: "deleteStudent",
    async fn() {
        const student = {
            name: "Student5",
            email: "emailfalso4@mail.com"
        }
        const createResponse = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        //guardo el id del estudiante creado
        const result = await createResponse.json();
        const id = result.id;
        //hago el delete del estudiante
        const response2 = await fetch(`https://proyecto-backend.deno.dev/student/${id}`, {
            method: "DELETE",
        });
        const result2 = await response2.json();
        assertEquals(result2.name, student.name);
        assertEquals(result2.email, student.email);
    }
});

//Test validate email
Deno.test({
    name: "email",
    async fn() {
      //Caso email valido
      const studentValidEmail = {
        name: "Student6",
        email: "emailcorrecto@mail.com",
      };
      const validEmailResponse = await fetch(`https://proyecto-backend.deno.dev/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentValidEmail),
      });
      const validEmailresult = await validEmailResponse.json();
      assertEquals(validEmailresult.name, studentValidEmail.name);
      assertEquals(validEmailresult.email, studentValidEmail.email);
  
      // Caso de correo electrónico inválido
      const studentInvalidEmail = {
        name: "Student7",
        email: "emailincorrecto",
      };
      const invalidEmailResponse = await fetch(`https://proyecto-backend.deno.dev/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentInvalidEmail),
      });

      //Deberia dar un mensaje de error
      const invalidEmailResult = await invalidEmailResponse.text();
      
      assertEquals(invalidEmailResponse.status, 500); //Error con status 500 debido al validate del modelo

      assertStringIncludes(invalidEmailResult, "Student validation failed: email: Validator failed for path `email` with value `emailincorrecto`"); //Mensaje de error del validate del modelo
  
      //Borramos los estudiantes creados, solo se deberia borrar el valido
      const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/student/${validEmailresult.id}`, {
        method: "DELETE",
      });

    await deleteResponse.text();
    }
});

//Test Middleware Hook deleteStudent con asignaturas