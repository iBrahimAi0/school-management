"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
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

      <div className="my-10 ">
        {isActive ? (
          <AttendanceRecordsList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Attendance Record</FieldLegend>
              <FieldDescription>
                Here you can create a Attendance Record
              </FieldDescription>
            </div>
            <AttendanceRecordForm
              handleSubmit={(values: AttendanceRecordFormValues) =>
                addAttendanceRecord(values)
              }
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
