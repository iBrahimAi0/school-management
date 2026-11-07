"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import { AttendanceSession } from "@/types/AdminTypes/AttendanceSessionValuesType";
import { AttendanceSessionForm } from "@/components/AdminParts/AttendanceSessionComponents/AttendanceSessionForm";
import AttendanceSessionsList from "@/components/AdminParts/AttendanceSessionComponents/AttendanceSessionsList";

export default function ManageAttendanceSessions() {
  const [isActive, setIsActive] = useState(true);
  const { addAttendanceSession } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Attendance Sessions
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new Attendance Session
        </Button>
      </ButtonGroup>

      <div className="my-10 ">
        {isActive ? (
          <AttendanceSessionsList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Attendance Session</FieldLegend>
              <FieldDescription>
                Here you can create a Attendance Session
              </FieldDescription>
            </div>
            <AttendanceSessionForm
              handleSubmit={(values: AttendanceSession) =>
                addAttendanceSession(values)
              }
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
