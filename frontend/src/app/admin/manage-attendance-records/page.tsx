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
import AttendanceRecordsList from "@/components/AdminParts/AttendanceRecordComponents/AttendanceRecordsList";
import { AttendanceRecordForm } from "@/components/AdminParts/AttendanceRecordComponents/AttendanceRecordForm";
import { AttendanceRecordFormValues } from "@/types/AdminTypes/AttendanceRecordValuesType";

export default function ManageAttendanceRecords() {
  const [isActive, setIsActive] = useState(true);
  const { addAttendanceRecord } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Attendance Records
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new Attendance Record
        </Button>
      </ButtonGroup>

      <div className="my-10">
        {isActive ? (
          <AttendanceRecordsList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Attendance Record</CardTitle>
              <CardDescription>
                Record student attendance status (present, late, absent).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceRecordForm
                handleSubmit={(values: AttendanceRecordFormValues) =>
                  addAttendanceRecord(values)
                }
                mode={"create"}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
