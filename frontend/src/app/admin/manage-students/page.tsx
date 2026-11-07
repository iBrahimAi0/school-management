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
import StudentsList from "@/components/AdminParts/StudentComponents/StudentsList";
import { StudentsForm } from "@/components/AdminParts/StudentComponents/StudentsForm";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";

export default function ManageStudents() {
  const [isActive, setIsActive] = useState(true);
  const { addStudent } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Students
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new student
        </Button>
      </ButtonGroup>

      <div className="my-10">
        {isActive ? (
          <StudentsList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Student</CardTitle>
              <CardDescription>
                Register a new student into the school directory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentsForm
                handleSubmit={(values: StudentTypes) => addStudent(values)}
                mode={"create"}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
