"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";

import ParentsList from "@/components/AdminParts/ParentComponents/ParentsList";
import { ParentsForm } from "@/components/AdminParts/ParentComponents/ParentsForm";
import { useUserContext } from "@/context/UserProvider";
import { ParentValuesType } from "@/types/AdminTypes/ParentValuesType";
import { FieldDescription, FieldLegend } from "@/components/ui/field";

export default function ManageParents() {
  const [isActive, setIsActive] = useState(true);
  const { addParent } = useUserContext();
  return (
    <>
      <ButtonGroup className="">
        <Button
          variant={`${isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(true)}>
          Parents
        </Button>
        <Button
          variant={`${!isActive ? "default" : "outline"}`}
          onClick={() => setIsActive(false)}>
          Add new parent
        </Button>
      </ButtonGroup>

      <div className="my-10 ">
        {isActive ? (
          <ParentsList />
        ) : (
          <div className="border p-5 rounded-xl flex flex-col gap-5">
            <div>
              <FieldLegend>Create Parent</FieldLegend>
              <FieldDescription>Here you can create a parent</FieldDescription>
            </div>
            <ParentsForm
              handleSubmit={(values: ParentValuesType) => addParent(values)}
            />
          </div>
        )}
      </div>
    </>
  );
}
