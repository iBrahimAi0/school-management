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
import ExamRecordsList from "@/components/AdminParts/ExamRecordComponents/ExamRecordsList";
import { ExamRecordForm } from "@/components/AdminParts/ExamRecordComponents/ExamRecordForm";
import { ExamRecordType } from "@/types/AdminTypes/ExamRecordValuesType";

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

      <div className="my-10">
        {isActive ? (
          <ExamRecordsList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Exam Record</CardTitle>
              <CardDescription>
                Record marks and feedback for an examination candidate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExamRecordForm
                handleSubmit={(values: ExamRecordType) => addExamRecord(values)}
                mode={"create"}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
