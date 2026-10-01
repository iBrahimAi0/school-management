"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import TeachersList from "@/components/TeacherComponents/TeachersList";
import { TeachersForm } from "@/components/TeacherComponents/TeachersForm";
import { TeacherValuesType } from "@/types/TeacherValuesType";
import ExamsList from "@/components/ExamComponents/ExamsList";
import { ExamForm } from "@/components/ExamComponents/ExamForm";
import { ExamValuesType } from "@/types/ExamValuesType";

export default function ManageParents() {
  const [isActive, setIsActive] = useState(true);
  const { addExam } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Exams
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new exam
        </Button>
      </ButtonGroup>

      <div className="my-10 ">
        {isActive ? (
          <ExamsList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Exam</FieldLegend>
              <FieldDescription>Here you can create a exam</FieldDescription>
            </div>
            <ExamForm
              handleSubmit={(values: ExamValuesType) => addExam(values)}
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
