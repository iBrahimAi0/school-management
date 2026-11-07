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
import CourseList from "@/components/AdminParts/CourseComponents/CourseList";
import { CourseForm } from "@/components/AdminParts/CourseComponents/CoursesForm";
import { CourseValuesType } from "@/types/AdminTypes/CourseValuesType";

export default function ManageCourses() {
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

      <div className="my-10">
        {isActive ? (
          <CourseList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Course</CardTitle>
              <CardDescription>
                Add a new course curriculum subject to the catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseForm
                handleSubmit={(values: CourseValuesType) => addCourse(values)}
                mode={"create"}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
