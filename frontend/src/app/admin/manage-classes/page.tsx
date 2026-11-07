"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import ClassesList from "@/components/AdminParts/ClasseComponents/ClassesList";
import { ClasseForm } from "@/components/AdminParts/ClasseComponents/ClasseForm";
import { ClasseValuesType } from "@/types/AdminTypes/ClasseValuesType";

export default function ManageParents() {
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

      <div className="my-10 ">
        {isActive ? (
          <ClassesList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Classe</FieldLegend>
              <FieldDescription>Here you can create a classe</FieldDescription>
            </div>
            <ClasseForm
              handleSubmit={(values: ClasseValuesType) => addClasse(values)}
              mode={"create"}
            />
          </div>
        )}
      </div>
    </>
  );
}
