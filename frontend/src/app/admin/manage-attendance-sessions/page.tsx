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

      <div className="my-10">
        {isActive ? (
          <AttendanceSessionsList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Attendance Session</CardTitle>
              <CardDescription>
                Open a new attendance tracking session for a class or course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceSessionForm
                handleSubmit={(values: AttendanceSession) =>
                  addAttendanceSession(values)
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
