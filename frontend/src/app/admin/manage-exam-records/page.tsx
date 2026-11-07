"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import ExamRecordsList from "@/components/AdminParts/ExamRecordComponents/ExamRecordsList";
import { ExamRecordForm } from "@/components/AdminParts/ExamRecordComponents/ExamRecordForm";
import {
  ExamRecordFormValuesType,
  ExamRecordType,
} from "@/types/AdminTypes/ExamRecordValuesType";

export default function ManageExamRecords() {
  const [isActive, setIsActive] = useState(true);
  const { addExamRecord } = useUserContext();
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
          <ExamRecordsList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Exam</FieldLegend>
              <FieldDescription>Here you can create a exam</FieldDescription>
            </div>
            <ExamRecordForm
              handleSubmit={(values: ExamRecordType) => addExamRecord(values)}
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
