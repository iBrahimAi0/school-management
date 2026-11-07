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
import ClassTypesList from "@/components/AdminParts/ClassTypeComponents/ClassTypesList";
import { ClassTypeForm } from "@/components/AdminParts/ClassTypeComponents/ClassTypeForm";
import { ClassTypeValuesType } from "@/types/AdminTypes/ClassTypeValuesType";

export default function ManageClassTypes() {
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

      <div className="my-10">
        {isActive ? (
          <ClassTypesList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Class Type</CardTitle>
              <CardDescription>
                Define a new grade level, branch, or class stream.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClassTypeForm
                handleSubmit={(values: ClassTypeValuesType) =>
                  addClassType(values)
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
