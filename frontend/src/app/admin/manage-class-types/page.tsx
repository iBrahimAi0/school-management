"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import TeachersList from "@/components/AdminParts/TeacherComponents/TeachersList";
import { TeachersForm } from "@/components/AdminParts/TeacherComponents/TeachersForm";
import { TeacherValuesType } from "@/types/AdminTypes/TeacherValuesType";
import ClassTypesList from "@/components/AdminParts/ClassTypeComponents/ClassTypesList";
import { ClassTypeForm } from "@/components/AdminParts/ClassTypeComponents/ClassTypeForm";
import { ClassTypeValuesType } from "@/types/AdminTypes/ClassTypeValuesType";

export default function ManageParents() {
  const [isActive, setIsActive] = useState(true);
  const { addClassType } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Class Types
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new Class Type
        </Button>
      </ButtonGroup>

      <div className="my-10 ">
        {isActive ? (
          <ClassTypesList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Class Type</FieldLegend>
              <FieldDescription>
                Here you can create a class type
              </FieldDescription>
            </div>
            <ClassTypeForm
              handleSubmit={(values: ClassTypeValuesType) =>
                addClassType(values)
              }
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
