"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import { ClassTypeCourseFormValues } from "@/types/ClassTypeCourseValuesTypes";
import ClassTypeCoursesList from "@/components/ClassTypeCourseComponents/ClassTypeCoursesList";
import { ClassTypeCourseForm } from "@/components/ClassTypeCourseComponents/ClassTypeCourseForm";

export default function ManageClassTypeCourse() {
  const [isActive, setIsActive] = useState(true);
  const { addClassTypeCourse } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Exam Records
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new exam record
        </Button>
      </ButtonGroup>

      <div className="my-10 ">
        {isActive ? (
          <ClassTypeCoursesList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Exam</FieldLegend>
              <FieldDescription>Here you can create a exam</FieldDescription>
            </div>
            <ClassTypeCourseForm
              handleSubmit={(values: ClassTypeCourseFormValues) =>
                addClassTypeCourse(values)
              }
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
