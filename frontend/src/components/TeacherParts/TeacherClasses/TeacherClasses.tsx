"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import ClasseApi from "@/api/Classe/ClasseApi";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/UserProvider";
import { TeacherClassesType } from "@/types/TeacherTypes/TeacherClassesType";

export function TeacherClasses() {
  const [classes, setClasses] = useState<TeacherClassesType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user?.id) return;

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
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Classes</h1>
        <p className="text-sm text-muted-foreground">
          View assigned classes, track student rosters, and manage classroom activities.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : classes.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No classes found</CardTitle>
            <CardDescription>
              You do not have any classes assigned to your account yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((classe) => (
            <Card
              key={classe.id}
              className="shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {classe.code}
                  </Badge>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{classe.name}</CardTitle>
                <CardDescription>
                  Program: {classe.class_type?.name ?? "Standard Academic"}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-2 border-t">
                <Button asChild className="w-full" size="sm">
                  <Link
                    href={`/teacher/classes/students?classeId=${classe.id}&classeName=${encodeURIComponent(
                      classe.name
                    )}`}
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    View Students
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
