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
import ClassesList from "@/components/AdminParts/ClasseComponents/ClassesList";
import { ClasseForm } from "@/components/AdminParts/ClasseComponents/ClasseForm";
import { ClasseValuesType } from "@/types/AdminTypes/ClasseValuesType";

export default function ManageClasses() {
  const [isActive, setIsActive] = useState(true);
  const { addClasse } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Classes
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new classe
        </Button>
      </ButtonGroup>

      <div className="my-10">
        {isActive ? (
          <ClassesList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Class</CardTitle>
              <CardDescription>
                Configure a new class section and assign faculty.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClasseForm
                handleSubmit={(values: ClasseValuesType) => addClasse(values)}
                mode={"create"}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
