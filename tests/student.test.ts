import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts";

//Test postStudent
Deno.test({
    name: "postStudent",
    async fn() {
        const student = {
            name: "Test1",
            email: "emailfalso1@mail.com"
        }
        const response = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        const result = await response.json();
        assertEquals(result.name, student.name);
        assertEquals(result.email, student.email);
        //borro el estudiante creado (tambien vale para comprobar el deleteStudent aunque ese test esta mas abajo)
        const response2 = await fetch(`https://proyecto-backend.deno.dev/student/${result._id}`, {
            method: "DELETE",
        });

        if(response2.status == 200){
            const result2 = await response2.json();
            assertEquals(result2.name, student.name);
            assertEquals(result2.email, student.email);
        }else if(response2.status == 404){
            const result2 = await response2.json();
            assertEquals(result2.error, "Student not found");
        }else{
            assertEquals(response2.status, 500);
        }
    }
});

//Test getStudents
Deno.test({
    name: "getStudents",
    async fn() {
        const response = await fetch("https://proyecto-backend.deno.dev/students");
        const result = await response.json();
        assertEquals(Array.isArray(result), true);
    }
});

//Test getStudent sin asignaturas
Deno.test({
    name: "getStudent",
    async fn() {
        const student = {
            name: "Test2",
            email: "emailfalso2@mail.com"
        }
        const response = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        //guardo el id del estudiante creado
        const result = await response.json();
        const id = result._id;
        //hago el get del estudiante
        const response2 = await fetch(`https://proyecto-backend.deno.dev/student/${id}`);
        const result2 = await response2.json();
        assertEquals(result2.name, student.name);
        assertEquals(result2.email, student.email);
    }
});

//Test putStudent
Deno.test({
    name: "putStudent",
    async fn() {
        const student = {
            name: "Test3",
            email: "emailfalso3@mail.com"
        }
        const response = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        //guardo el id del estudiante creado
        const result = await response.json();
        const id = result._id;
        //hago el put del estudiante
        const student2 = {
            name: "Test4",
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
    }
});

//Test deleteStudent
Deno.test({
    name: "deleteStudent",
    async fn() {
        const student = {
            name: "Test5",
            email: "emailfalso4@mail.com"
        }
        const response = await fetch("https://proyecto-backend.deno.dev/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        //guardo el id del estudiante creado
        const result = await response.json();
        const id = result._id;
        //hago el delete del estudiante
        const response2 = await fetch(`https://proyecto-backend.deno.dev/student/${id}`, {
            method: "DELETE",
        });
        const result2 = await response2.json();
        assertEquals(result2.name, student.name);
        assertEquals(result2.email, student.email);
    }
});

//Test email
Deno.test({
    name: "email",
    async fn() {
      //Caso email valido
      const studentValidEmail = {
        name: "Test6",
        email: "emailcorrecto@mail.com",
      };
      const responseValidEmail = await fetch(`https://proyecto-backend.deno.dev/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentValidEmail),
      });
      const resultValidEmail = await responseValidEmail.json();
      assertEquals(resultValidEmail.name, studentValidEmail.name);
      assertEquals(resultValidEmail.email, studentValidEmail.email);
  
      // Caso de correo electrónico inválido
      const studentInvalidEmail = {
        name: "Test7",
        email: "emailincorrecto",
      };
      const responseInvalidEmail = await fetch(`https://proyecto-backend.deno.dev/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentInvalidEmail),
      });
      const resultInvalidEmail = await responseInvalidEmail.json();
      
      assertEquals(responseInvalidEmail.status, 400);

      assertEquals(resultInvalidEmail.error, "Invalid email format");
  
      //Borramos los estudiantes creados
      await fetch(`https://proyecto-backend.deno.dev/student/${resultValidEmail._id}`, {
        method: "DELETE",
      });
  
      await fetch(`https://proyecto-backend.deno.dev/student/${resultInvalidEmail._id}`, {
        method: "DELETE",
      });
    },
  });