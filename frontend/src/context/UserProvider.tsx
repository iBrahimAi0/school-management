"use client";

import AttendanceSessionApi from "@/api/AttendanceSession/AttendanceSessionApi";
import ClasseApi from "@/api/Classe/ClasseApi";
import ClassTypeApi from "@/api/ClassType/ClassTypeApi";
import ClassTypeCoursesApi from "@/api/ClassTypeCourses/ClassTypeCoursesApi";
import CourseApi from "@/api/Course/CourseApi";
import ExamApi from "@/api/Exam/ExamApi";
import ExamRecordApi from "@/api/ExamRecord/ExamRecordApi";
import ParentApi from "@/api/Parent/ParentApi";
import { StudentApi } from "@/api/Student/StudentApi";
import TeacherApi from "@/api/Teacher/TeacherApi";
import { UserApi } from "@/api/User/UserApi";
import {
  AttendanceSession,
  AttendanceSessionFormValues,
} from "@/types/AttendanceSessionValuesType";
import { ClassTypeCourseFormValues } from "@/types/ClassTypeCourseValuesTypes";
import { ClassTypeValuesType } from "@/types/ClassTypeValuesType";
import { CourseValuesType } from "@/types/CourseValuesType";
import { ExamRecordType } from "@/types/ExamRecordValuesType";
import { ExamType } from "@/types/ExamValuesType";
import { ParentValuesType } from "@/types/ParetnValuesType";
import { StudentValuesType } from "@/types/StudentValuesType";
import { TeacherValuesType } from "@/types/TeacherValuesType";
import { valuesType } from "@/types/ValuesType";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  adress?: string;
  blood_type?: string;
  avatar?: string;
}

export type Role = "admin" | "teacher" | "student" | "parent" | null;

interface UserStateContextType {
  user: User | null;
  login: (values: valuesType) => Promise<void>;
  logout: () => Promise<void>;
  role: Role;
  loader: boolean;
  addParent: (parentValues: ParentValuesType) => Promise<any>;
  updateParent: (parentValues: ParentValuesType, id: string) => Promise<any>;
  addStudent: (studentValues: StudentValuesType) => Promise<any>;
  updateStudent: (studentValues: StudentValuesType, id: string) => Promise<any>;
  updateTeacher: (teacherValues: TeacherValuesType, id: string) => Promise<any>;
  addTeacher: (teacherValues: TeacherValuesType) => Promise<any>;
  addClassType: (classTypeValues: ClassTypeValuesType) => Promise<any>;
  updateClassType: (
    classTypeValues: ClassTypeValuesType,
    id: string,
  ) => Promise<any>;
  addClasse: (classeValues: ClassTypeValuesType) => Promise<any>;
  updateClasse: (classeValues: ClassTypeValuesType, id: string) => Promise<any>;
  addCourse: (courseValues: CourseValuesType) => Promise<any>;
  updateCourse: (courseValues: CourseValuesType, id: string) => Promise<any>;
  addExam: (examValues: ExamType) => Promise<any>;
  updateExam: (id: string, examValues: ExamType) => Promise<any>;
  addExamRecord: (examRecordValues: ExamRecordType) => Promise<any>;
  updateExamRecord: (
    id: string,
    examRecordValues: ExamRecordType,
  ) => Promise<any>;
  addClassTypeCourse: (
    classTypeCourseValues: ClassTypeCourseFormValues,
  ) => Promise<any>;
  updateClassTypeCourse: (
    id: string,
    classTypeCourseValues: ClassTypeCourseFormValues,
  ) => Promise<any>;
  updateAttendanceSession: (
    id: string,
    attendanceSessionValues: AttendanceSessionFormValues,
  ) => Promise<any>;
  addAttendanceSession: (
    attendanceSessionValues: AttendanceSessionFormValues,
  ) => Promise<any>;
}

const UserContext = createContext<UserStateContextType | null>(null);

export const UserProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loader, setLoader] = useState(true);
  const [role, setRole] = useState<Role>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        const res = await UserApi.getUser();
        if (isMounted && res.data && res.data.user) {
          setUser(res.data.user);
          setRole(res.data.role);
          document.cookie = `user_role=${res.data.role}; path=/; max-age=604800; SameSite=Lax`;
        }
      } catch {
        if (isMounted) {
          document.cookie =
            "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
          setUser(null);
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoader(false);
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ email, password }: valuesType) => {
    try {
      // 2. Submit credentials (Login returns role and user)
      const authData = await UserApi.login({ email, password });
      setUser(authData.user);
      setRole(authData.role);

      // 3. Store routing hint cookie for Next.js middleware
      document.cookie = `user_role=${authData.role}; path=/; max-age=604800; SameSite=Lax`;

      // 4. Redirect using returned authData.role
      router.push(`/${authData.role}/dashboard`);
    } catch (error: unknown) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await UserApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      document.cookie =
        "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      setUser(null);
      setRole(null);
      setLoader(false);
      router.push("/login");
    }
  };
  const addParent = async ({
    first_name,
    last_name,
    date_of_birth,
    gender,
    blood_type,
    address,
    phone,
    email,
    password,
    password_confirmation,
  }: ParentValuesType) => {
    try {
      const response = await ParentApi.addParent({
        first_name,
        last_name,
        date_of_birth,
        gender,
        blood_type,
        address,
        phone,
        email,
        password,
        password_confirmation,
      });

      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateParent = async (values: ParentValuesType, id: string) => {
    try {
      const response = await ParentApi.updateParent(values, id);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const addStudent = async (values: StudentValuesType) => {
    try {
      const response = await StudentApi.addStudent(values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateStudent = async (values: StudentValuesType, id: string) => {
    try {
      const response = await StudentApi.updateStudent(values, id);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateTeacher = async (values: TeacherValuesType, id: string) => {
    try {
      const response = await TeacherApi.updateTeacher(values, id);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const addTeacher = async (values: TeacherValuesType) => {
    try {
      const response = await TeacherApi.addTeacher(values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const addClassType = async (values: ClassTypeValuesType) => {
    try {
      const response = await ClassTypeApi.addClassType(values);

      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateClassType = async (values: ClassTypeValuesType, id: string) => {
    try {
      const response = await ClassTypeApi.updateClassType(values, id);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const addClasse = async (values: ClassTypeValuesType) => {
    try {
      const response = await ClasseApi.addClasse(values);

      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateClasse = async (values: ClassTypeValuesType, id: string) => {
    try {
      const response = await ClasseApi.updateClasse(values, id);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const addCourse = async (values: CourseValuesType) => {
    try {
      const response = await CourseApi.addCourse(values);

      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateCourse = async (values: CourseValuesType, id: string) => {
    try {
      const response = await CourseApi.updateCourse(values, id);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const addExam = async (values: ExamType) => {
    try {
      const response = await ExamApi.addExam(values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateExam = async (id: string, values: ExamType) => {
    try {
      const response = await ExamApi.updateExam(id, values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const addExamRecord = async (values: ExamRecordType) => {
    try {
      const response = await ExamRecordApi.addExamRecord(values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateExamRecord = async (id: string, values: ExamRecordType) => {
    try {
      const response = await ExamRecordApi.updateExamRecord(id, values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const addClassTypeCourse = async (values: ClassTypeCourseFormValues) => {
    try {
      const response = await ClassTypeCoursesApi.addClassTypeCourse(values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateClassTypeCourse = async (
    id: string,
    values: ClassTypeCourseFormValues,
  ) => {
    try {
      const response = await ClassTypeCoursesApi.updateClassTypeCourse(
        id,
        values,
      );
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const addAttendanceSession = async (values: AttendanceSessionFormValues) => {
    try {
      const response = await AttendanceSessionApi.addAttendanceSession(values);
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };
  const updateAttendanceSession = async (
    id: string,
    values: AttendanceSessionFormValues,
  ) => {
    try {
      const response = await AttendanceSessionApi.updateAttendanceSession(
        id,
        values,
      );
      return response;
    } catch (error: unknown) {
      console.error(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        role,
        logout,
        loader,
        addParent,
        updateParent,
        updateStudent,
        addStudent,
        updateTeacher,
        addTeacher,
        addClassType,
        updateClassType,
        addClasse,
        updateClasse,
        addCourse,
        updateCourse,
        addExam,
        updateExam,
        addExamRecord,
        updateExamRecord,
        addClassTypeCourse,
        updateClassTypeCourse,
        addAttendanceSession,
        updateAttendanceSession,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used inside UserProvider");
  }
  return context;
};
