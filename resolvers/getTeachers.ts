// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Teacher } from "../types.ts";
import { TeacherModel } from "../db/teacher.ts";
import { getTeacherFromModel } from "../controllers/getTeacherFromModel.ts";

export const getTeachers = async (_req: Request, res: Response<Teacher[] | { error: unknown }>) => {
    try {
        const teachers = await TeacherModel.find({}).exec();
        const teachersResponse: Teacher[] = await Promise.all(teachers.map(async (teacher) => await getTeacherFromModel(teacher)));
        res.status(200).json(teachersResponse).send();
    } catch (error) {
        res.status(500).send(error);
    }
}