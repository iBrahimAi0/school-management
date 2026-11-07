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
import ExamsList from "@/components/AdminParts/ExamComponents/ExamsList";
import { ExamForm } from "@/components/AdminParts/ExamComponents/ExamForm";
import { ExamValuesType } from "@/types/AdminTypes/ExamValuesType";

export default function ManageExams() {
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

      <div className="my-10">
        {isActive ? (
          <ExamsList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Exam</CardTitle>
              <CardDescription>
                Schedule an academic examination or assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExamForm
                handleSubmit={(values: ExamValuesType) => addExam(values)}
                mode={"create"}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
