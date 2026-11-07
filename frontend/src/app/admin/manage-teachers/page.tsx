"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TeachersList from "@/components/AdminParts/TeacherComponents/TeachersList";
import { TeachersForm } from "@/components/AdminParts/TeacherComponents/TeachersForm";
import { TeacherValuesType } from "@/types/AdminTypes/TeacherValuesType";

export default function ManageTeachers() {
  const [isActive, setIsActive] = useState(true);
  const { addTeacher } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Teachers
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new teacher
        </Button>
      </ButtonGroup>

      <div className="my-10">
        {isActive ? (
          <TeachersList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Teacher</CardTitle>
              <CardDescription>
                Register a new teacher faculty member into the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeachersForm
                handleSubmit={(values: TeacherValuesType) => addTeacher(values)}
                mode={"create"}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
