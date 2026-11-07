"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import TeachersList from "@/components/AdminParts/TeacherComponents/TeachersList";
import { TeachersForm } from "@/components/AdminParts/TeacherComponents/TeachersForm";
import { TeacherValuesType } from "@/types/AdminTypes/TeacherValuesType";

export default function ManageParents() {
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

      <div className="my-10 ">
        {isActive ? (
          <TeachersList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Teacher</FieldLegend>
              <FieldDescription>Here you can create a teacher</FieldDescription>
            </div>
            <TeachersForm
              handleSubmit={(values: TeacherValuesType) => addTeacher(values)}
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
