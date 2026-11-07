"use client";
import ClasseApi from "@/api/Classe/ClasseApi";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/UserProvider";
import { TeacherClassesType } from "@/types/TeacherTypes/TeacherClassesType";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TeacherClasses() {
  const [classes, setClasses] = useState<TeacherClassesType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await ClasseApi.getTeacherClasses(user.id);
        setClasses(response.data.teacherClasses || []);
      } catch (error) {
        console.error("Error fetching teacher classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user?.id]);

  return (
    <div className="flex flex-wrap gap-5 items-start">
      {loading ? (
        <div className="flex h-100 m-auto max-w-100 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : classes.length === 0 ? (
        <div className="w-full text-center py-10 text-muted-foreground">
          No classes assigned to you yet.
        </div>
      ) : (
        classes.map((classe, key) => (
          <Card className="relative mx-auto w-full max-w-sm pt-0" key={key}>
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src="/classeImage.png"
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">{classe.code}</Badge>
              </CardAction>
              <CardTitle>{classe.name}</CardTitle>
              <CardDescription>{classe.class_type?.name}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link
                  href={`/teacher/classes/students?classeId=${classe.id}&classeName=${encodeURIComponent(classe.name)}`}>
                  View Students
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
