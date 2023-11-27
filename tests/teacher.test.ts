import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.203.0/assert/mod.ts";

//Test postTeacher
Deno.test({
    name: "postTeacher",
    async fn() {
        //Creamos un profesor
        const teacher = {
            name: "Teacher1",
            email: "emailteacher1@mail.com"
        }

        const createResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher) //Convierte el objeto a un string (tipo raw JSON para que lo entienda el servidor)
        });
        const result = await createResponse.json();

        assertEquals(result.name, teacher.name);
        assertEquals(result.email, teacher.email);

        //Borramos el profesor creado
        const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${result.id}`, {
            method: "DELETE",
        });

        await deleteResponse.text(); //Hay que consumir el cuerpo de la respuesta para que la conexion se cierre
    }
});

//Test getTeachers
Deno.test({
    name: "getTeachers",
    async fn() {
        //Creamos varios profesores
        const teacher1 = {
            name: "Teacher2",
            email: "emailteacher2@mail.com"
        }
        const teacher2 = {
            name: "Teacher3",
            email: "emailteacher3@mail.com"
        }

        //Los guardamos en la base de datos
        const createResponse1 = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher1) 
        });

        const createResponse2 = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher2) 
        });

        //Obtenemos los profesores
        const getResponse = await fetch("https://proyecto-backend.deno.dev/teachers");
        const result = await getResponse.json();

        //Comprobamos que los profesores creados estan en la lista
        assertEquals(result[0].name, teacher1.name);
        assertEquals(result[0].email, teacher1.email);
        assertEquals(result[1].name, teacher2.name);
        assertEquals(result[1].email, teacher2.email);

        //Borramos los profesores creados
        const deleteResponse1 = await fetch(`https://proyecto-backend.deno.dev/teacher/${result[0].id}`, {
            method: "DELETE",
        });

        const deleteResponse2 = await fetch(`https://proyecto-backend.deno.dev/teacher/${result[1].id}`, {
            method: "DELETE",
        });

        //Consumimos los cuerpos de las respuestas
        await createResponse1.text();
        await createResponse2.text();

        await deleteResponse1.text();
        await deleteResponse2.text();
    }
});


//Test getTeacher
Deno.test({
    name: "getTeacher",
    async fn() {
        //Creamos un profesor
        const teacher = {
            name: "Teacher4",
            email: "emailteacher4@mail.com"
        }

        //Lo guardamos en la base de datos
        const createResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher)
        });

        const result = await createResponse.json();

        //Obtenemos el profesor
        const getResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${result.id}`);
        const getResult = await getResponse.json();

        //Comprobamos que el profesor creado es el mismo que el obtenido
        assertEquals(getResult.name, teacher.name);
        assertEquals(getResult.email, teacher.email);

        //Borramos el profesor creado
        const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${result.id}`, {
            method: "DELETE",
        });

        //Consumimos el cuerpo de la respuesta
        await deleteResponse.text();
    }
});

//Test putTeacher
Deno.test({
    name: "putTeacher",
    async fn() {
        //Creamos un profesor
        const teacher = {
            name: "Teacher5",
            email: "emailteacher5@mail.com"
        }

        //Lo guardamos en la base de datos
        const createResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher)
        });

        const result = await createResponse.json();

        //Actualizamos el profesor
        const putResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${result.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: "Teacher6", email: "nuevomailteacher6@mail.com" })
        });

        const putResult = await putResponse.json();

        //Comprobamos que el profesor se ha actualizado
        assertEquals(putResult.name, "Teacher6");
        assertEquals(putResult.email, "nuevomailteacher6@mail.com");

        //Borramos el profesor creado
        const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${result.id}`, {
            method: "DELETE",
        });

        await deleteResponse.text();
    }
});

//Test deleteTeacher
Deno.test({
    name: "deleteTeacher",
    async fn() {
        //Creamos un profesor
        const teacher = {
            name: "Teacher7",
            email: "mailteacher7@mail.com"
        }

        //Lo guardamos en la base de datos
        const createResponse = await fetch("https://proyecto-backend.deno.dev/teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacher)
        });

        const result = await createResponse.json();

        //Borramos el profesor creado
        const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${result.id}`, {
            method: "DELETE",
        });

        const deleteResult = await deleteResponse.json();

        //Comprobamos que el profesor borrado es el mismo que el creado
        assertEquals(deleteResult.name, teacher.name);
    }
});

//Test validate email
Deno.test({
    name: "email",
    async fn() {
      //Caso email valido
      const teacherValidEmail = {
        name: "Teacher6",
        email: "emailcorrecto@mail.com",
      };
      const validEmailResponse = await fetch(`https://proyecto-backend.deno.dev/teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherValidEmail),
      });
      const validEmailresult = await validEmailResponse.json();
      assertEquals(validEmailresult.name, teacherValidEmail.name);
      assertEquals(validEmailresult.email, teacherValidEmail.email);
  
      // Caso de correo electrónico inválido
      const teacherInvalidEmail = {
        name: "Teacher7",
        email: "emailincorrecto",
      };
      const invalidEmailResponse = await fetch(`https://proyecto-backend.deno.dev/teacher`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherInvalidEmail),
      });

      //Deberia dar un mensaje de error
      const invalidEmailResult = await invalidEmailResponse.text();
      
      assertEquals(invalidEmailResponse.status, 500); //Error con status 500 debido al validate del modelo

      assertStringIncludes(invalidEmailResult, "Teacher validation failed: email: Validator failed for path `email` with value `emailincorrecto`"); //Mensaje de error del validate del modelo
  
      //Borramos los estudiantes creados, solo se deberia borrar el valido
      const deleteResponse = await fetch(`https://proyecto-backend.deno.dev/teacher/${validEmailresult.id}`, {
        method: "DELETE",
      });

    await deleteResponse.text();
    }
});
