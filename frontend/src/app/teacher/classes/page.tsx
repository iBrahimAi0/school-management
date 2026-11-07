"use client";

import { useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { TeacherClasses } from "@/components/TeacherParts/TeacherClasses/TeacherClasses";

export default function ManageClasses() {
  return (
    <>
      <div className="my-10 ">
        <TeacherClasses />
      </div>
    </>
  );
}
