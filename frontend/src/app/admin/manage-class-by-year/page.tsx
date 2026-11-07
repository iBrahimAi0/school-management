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
import { ClassTypeCourseFormValues } from "@/types/AdminTypes/ClassTypeCourseValuesTypes";
import ClassTypeCoursesList from "@/components/AdminParts/ClassTypeCourseComponents/ClassTypeCoursesList";
import { ClassTypeCourseForm } from "@/components/AdminParts/ClassTypeCourseComponents/ClassTypeCourseForm";

export default function ManageClassTypeCourse() {
  const [isActive, setIsActive] = useState(true);
  const { addClassTypeCourse } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Class Courses
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Assign new course
        </Button>
      </ButtonGroup>

      <div className="my-10">
        {isActive ? (
          <ClassTypeCoursesList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Assign Course to Class</CardTitle>
              <CardDescription>
                Map a curriculum subject to a specific class type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClassTypeCourseForm
                handleSubmit={(values: ClassTypeCourseFormValues) =>
                  addClassTypeCourse(values)
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
