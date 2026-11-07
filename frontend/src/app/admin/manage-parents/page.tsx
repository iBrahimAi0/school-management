"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ParentsList from "@/components/AdminParts/ParentComponents/ParentsList";
import { ParentsForm } from "@/components/AdminParts/ParentComponents/ParentsForm";
import { useUserContext } from "@/context/UserProvider";
import { ParentValuesType } from "@/types/AdminTypes/ParentValuesType";

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

      <div className="my-10">
        {isActive ? (
          <ParentsList />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Parent</CardTitle>
              <CardDescription>
                Register a new parent or guardian account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParentsForm
                handleSubmit={(values: ParentValuesType) => addParent(values)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
