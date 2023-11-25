import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts";

import { getStudentFromModel } from "../controllers/getStudentFromModel.ts";
import { StudentModel } from "../db/student.ts";
import { Student } from "../types.ts";

import {app} from "../main.ts"

//Test para postStudent llamando a Deno Deploy  

Deno.test({
    name: "postStudent",
    async fn() {
        const student = {
            name: "Test",
            email: "hola@hola.com"
        }
        const response = await fetch("https://proyecto-backend.deno.dev/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        const result = await response.json();
        assertEquals(result.name, student.name);
        assertEquals(result.email, student.email);
    }
});

