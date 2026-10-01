"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import StudentsList from "@/components/StudentComponents/StudentsList";
import { StudentsForm } from "@/components/StudentComponents/StudentsForm";
import { StudentValuesType } from "@/types/StudentValuesType";

export default function ManageParents() {
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

      <div className="my-10 ">
        {isActive ? (
          <StudentsList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Student</FieldLegend>
              <FieldDescription>Here you can create a student</FieldDescription>
            </div>
            <StudentsForm
              handleSubmit={(values: StudentValuesType) => addStudent(values)}
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
