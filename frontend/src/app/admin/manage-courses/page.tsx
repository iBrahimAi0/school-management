"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import CourseList from "@/components/AdminParts/CourseComponents/CourseList";
import { CourseForm } from "@/components/AdminParts/CourseComponents/CoursesForm";
import { CourseValuesType } from "@/types/AdminTypes/CourseValuesType";

export default function ManageParents() {
  const [isActive, setIsActive] = useState(true);
  const { addCourse } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Courses
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new course
        </Button>
      </ButtonGroup>

      <div className="my-10 ">
        {isActive ? (
          <CourseList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Course</FieldLegend>
              <FieldDescription>Here you can create a course</FieldDescription>
            </div>
            <CourseForm
              handleSubmit={(values: CourseValuesType) => addCourse(values)}
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
