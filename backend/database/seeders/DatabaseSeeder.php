<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\Classe;
use App\Models\ClassType;
use App\Models\Course;
use App\Models\StudentParent;
use App\Models\Teacher;
use App\Models\Exam;
use App\Models\ExamRecord;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admins
        Admin::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'Director',
                'date_of_birth' => '1985-05-15',
                'gender' => 'm',
                'address' => '100 University Boulevard, Academic City',
                'phone' => '0612345678',
                'last_login_date' => now(),
                'password' => Hash::make('admin123456'),
            ]
        );

        // 2. Create Teachers
        $demoTeacher = Teacher::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Connor',
                'date_of_birth' => '1988-09-20',
                'gender' => 'f',
                'blood_type' => 'A+',
                'address' => '450 Innovation Way, Silicon Park',
                'phone' => '0661234567',
                'last_login_date' => now(),
                'password' => Hash::make('teacher123456'),
            ]
        );

        $teacher2 = Teacher::firstOrCreate(
            ['email' => 'prof.davis@example.com'],
            [
                'first_name' => 'Robert',
                'last_name' => 'Davis',
                'date_of_birth' => '1982-03-11',
                'gender' => 'm',
                'blood_type' => 'O+',
                'address' => '22 Science Park Ave',
                'phone' => '0662345678',
                'last_login_date' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        $teacher3 = Teacher::firstOrCreate(
            ['email' => 'dr.smith@example.com'],
            [
                'first_name' => 'Emily',
                'last_name' => 'Smith',
                'date_of_birth' => '1990-11-04',
                'gender' => 'f',
                'blood_type' => 'B+',
                'address' => '78 Research Drive',
                'phone' => '0663456789',
                'last_login_date' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        // 3. Create Class Types (Curriculum Tracks)
        $trackWD = ClassType::firstOrCreate(['code' => 'WD-DEV'], ['name' => 'Full-Stack Web Development']);
        $trackCS = ClassType::firstOrCreate(['code' => 'CS-ENG'], ['name' => 'Computer Science & Engineering']);
        $trackDS = ClassType::firstOrCreate(['code' => 'DS-AI'], ['name' => 'Data Science & Artificial Intelligence']);
        $trackGD = ClassType::firstOrCreate(['code' => 'UX-DES'], ['name' => 'UI/UX & Digital Design']);

        // 4. Create Courses (Subjects)
        $courseWeb = Course::firstOrCreate(['name' => 'Full-Stack Web Development'], ['description' => 'Modern Next.js, React, Node.js & Laravel architecture.']);
        $courseDB = Course::firstOrCreate(['name' => 'Relational Database Systems'], ['description' => 'MySQL, indexing, query optimization and normalization.']);
        $courseAlgo = Course::firstOrCreate(['name' => 'Data Structures & Algorithms'], ['description' => 'Algorithmic efficiency, Big-O analysis and system design.']);
        $courseUI = Course::firstOrCreate(['name' => 'UI/UX Interface Design'], ['description' => 'Design systems, accessibility, Figma, and component libraries.']);
        $courseSec = Course::firstOrCreate(['name' => 'Cybersecurity & Authentication'], ['description' => 'Network security, token protocols, and cryptography fundamentals.']);

        // 5. Attach Courses to Curriculum Tracks (class_type_courses)
        DB::table('class_type_courses')->updateOrInsert(['class_type_id' => $trackWD->id, 'course_id' => $courseWeb->id]);
        DB::table('class_type_courses')->updateOrInsert(['class_type_id' => $trackWD->id, 'course_id' => $courseDB->id]);
        DB::table('class_type_courses')->updateOrInsert(['class_type_id' => $trackWD->id, 'course_id' => $courseUI->id]);

        DB::table('class_type_courses')->updateOrInsert(['class_type_id' => $trackCS->id, 'course_id' => $courseAlgo->id]);
        DB::table('class_type_courses')->updateOrInsert(['class_type_id' => $trackCS->id, 'course_id' => $courseDB->id]);
        DB::table('class_type_courses')->updateOrInsert(['class_type_id' => $trackCS->id, 'course_id' => $courseSec->id]);

        // 6. Assign Courses to Teachers (course_teacher)
        DB::table('course_teacher')->updateOrInsert(['teacher_id' => $demoTeacher->id, 'course_id' => $courseWeb->id]);
        DB::table('course_teacher')->updateOrInsert(['teacher_id' => $demoTeacher->id, 'course_id' => $courseDB->id]);
        DB::table('course_teacher')->updateOrInsert(['teacher_id' => $teacher2->id, 'course_id' => $courseAlgo->id]);
        DB::table('course_teacher')->updateOrInsert(['teacher_id' => $teacher3->id, 'course_id' => $courseUI->id]);

        // 7. Create Classrooms & Assign Head Teachers
        $classWD201 = Classe::firstOrCreate(
            ['code' => 'WD201'],
            [
                'name' => 'Web Development Section Alpha',
                'class_type_id' => $trackWD->id,
                'teacher_id' => $demoTeacher->id,
            ]
        );

        $classCS101 = Classe::firstOrCreate(
            ['code' => 'CS101'],
            [
                'name' => 'Computer Science Section Beta',
                'class_type_id' => $trackCS->id,
                'teacher_id' => $teacher2->id,
            ]
        );

        $classUX301 = Classe::firstOrCreate(
            ['code' => 'UX301'],
            [
                'name' => 'UI Design Section Gamma',
                'class_type_id' => $trackGD->id,
                'teacher_id' => $teacher3->id,
            ]
        );

        // 8. Create Parents (Guardians)
        $demoParent = StudentParent::firstOrCreate(
            ['email' => 'parent@example.com'],
            [
                'first_name' => 'Michael',
                'last_name' => 'Johnson',
                'date_of_birth' => '1978-04-12',
                'gender' => 'm',
                'blood_type' => 'O+',
                'address' => '742 Evergreen Terrace, Springfield',
                'phone' => '0671234567',
                'last_login_date' => now(),
                'password' => Hash::make('parent123456'),
            ]
        );

        $parent2 = StudentParent::firstOrCreate(
            ['email' => 'helen.martin@example.com'],
            [
                'first_name' => 'Helen',
                'last_name' => 'Martin',
                'date_of_birth' => '1980-08-25',
                'gender' => 'f',
                'blood_type' => 'A-',
                'address' => '12 Maple Avenue, Oakridge',
                'phone' => '0672345678',
                'last_login_date' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        // 9. Create Students & Link to Parents and Classrooms
        $demoStudent = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'first_name' => 'Alex',
                'last_name' => 'Johnson',
                'date_of_birth' => '2004-06-18',
                'gender' => 'm',
                'blood_type' => 'O+',
                'student_parent_id' => $demoParent->id,
                'classe_id' => $classWD201->id,
                'last_login_date' => now(),
                'password' => Hash::make('student123456'),
            ]
        );

        $student2 = User::firstOrCreate(
            ['email' => 'sophia.martin@example.com'],
            [
                'first_name' => 'Sophia',
                'last_name' => 'Martin',
                'date_of_birth' => '2005-02-14',
                'gender' => 'f',
                'blood_type' => 'A-',
                'student_parent_id' => $parent2->id,
                'classe_id' => $classWD201->id,
                'last_login_date' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        $student3 = User::firstOrCreate(
            ['email' => 'daniel.lee@example.com'],
            [
                'first_name' => 'Daniel',
                'last_name' => 'Lee',
                'date_of_birth' => '2004-09-30',
                'gender' => 'm',
                'blood_type' => 'B+',
                'student_parent_id' => $demoParent->id, // sibling of Alex!
                'classe_id' => $classCS101->id,
                'last_login_date' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        // Additional Classmates for realistic class roster
        $classmates = [
            ['first_name' => 'Lucas', 'last_name' => 'Dubois', 'email' => 'lucas.d@example.com', 'gender' => 'm', 'blood' => 'O+'],
            ['first_name' => 'Emma', 'last_name' => 'Watson', 'email' => 'emma.w@example.com', 'gender' => 'f', 'blood' => 'AB+'],
            ['first_name' => 'Liam', 'last_name' => 'Smith', 'email' => 'liam.s@example.com', 'gender' => 'm', 'blood' => 'A+'],
            ['first_name' => 'Olivia', 'last_name' => 'Taylor', 'email' => 'olivia.t@example.com', 'gender' => 'f', 'blood' => 'B-'],
            ['first_name' => 'Noah', 'last_name' => 'Brown', 'email' => 'noah.b@example.com', 'gender' => 'm', 'blood' => 'O-'],
        ];

        foreach ($classmates as $cm) {
            User::firstOrCreate(
                ['email' => $cm['email']],
                [
                    'first_name' => $cm['first_name'],
                    'last_name' => $cm['last_name'],
                    'date_of_birth' => '2004-10-10',
                    'gender' => $cm['gender'],
                    'blood_type' => $cm['blood'],
                    'student_parent_id' => $demoParent->id,
                    'classe_id' => $classWD201->id,
                    'last_login_date' => now(),
                    'password' => Hash::make('password123'),
                ]
            );
        }

        // 10. Create Exams
        $examWeb = Exam::firstOrCreate(
            ['name' => 'Midterm Web Applications Assessment'],
            [
                'type' => 'cc',
                'teacher_id' => $demoTeacher->id,
                'course_id' => $courseWeb->id,
                'classe_id' => $classWD201->id,
                'file_path' => 'exams/midterm_web_2026.pdf',
                'original_name' => 'midterm_web_2026.pdf',
                'mime_type' => 'application/pdf',
                'size' => 1024 * 512,
            ]
        );

        $examDB = Exam::firstOrCreate(
            ['name' => 'Final Relational Databases Evaluation (EFM)'],
            [
                'type' => 'efm',
                'teacher_id' => $demoTeacher->id,
                'course_id' => $courseDB->id,
                'classe_id' => $classWD201->id,
                'file_path' => 'exams/final_db_2026.pdf',
                'original_name' => 'final_db_2026.pdf',
                'mime_type' => 'application/pdf',
                'size' => 1024 * 768,
            ]
        );

        // 11. Create Exam Records (Grades)
        ExamRecord::updateOrCreate(
            ['exam_id' => $examWeb->id, 'user_id' => $demoStudent->id],
            [
                'note' => 18.5,
                'comment' => 'Outstanding mastery of React components and API integration.',
            ]
        );

        ExamRecord::updateOrCreate(
            ['exam_id' => $examDB->id, 'user_id' => $demoStudent->id],
            [
                'note' => 16.0,
                'comment' => 'Great schema design and efficient relational indexing.',
            ]
        );

        ExamRecord::updateOrCreate(
            ['exam_id' => $examWeb->id, 'user_id' => $student2->id],
            [
                'note' => 15.5,
                'comment' => 'Good design structure, review async error boundary patterns.',
            ]
        );

        // 12. Create Attendance Sessions
        $session1 = AttendanceSession::firstOrCreate(
            [
                'classe_id' => $classWD201->id,
                'course_id' => $courseWeb->id,
                'teacher_id' => $demoTeacher->id,
                'date' => now()->subDays(3)->format('Y-m-d'),
            ]
        );

        $session2 = AttendanceSession::firstOrCreate(
            [
                'classe_id' => $classWD201->id,
                'course_id' => $courseDB->id,
                'teacher_id' => $demoTeacher->id,
                'date' => now()->subDays(1)->format('Y-m-d'),
            ]
        );

        $session3 = AttendanceSession::firstOrCreate(
            [
                'classe_id' => $classWD201->id,
                'course_id' => $courseWeb->id,
                'teacher_id' => $demoTeacher->id,
                'date' => now()->format('Y-m-d'),
            ]
        );

        // 13. Create Attendance Records
        AttendanceRecord::updateOrCreate(
            ['attendance_session_id' => $session1->id, 'user_id' => $demoStudent->id],
            ['status' => 'present']
        );
        AttendanceRecord::updateOrCreate(
            ['attendance_session_id' => $session2->id, 'user_id' => $demoStudent->id],
            ['status' => 'present']
        );
        AttendanceRecord::updateOrCreate(
            ['attendance_session_id' => $session3->id, 'user_id' => $demoStudent->id],
            ['status' => 'late']
        );

        AttendanceRecord::updateOrCreate(
            ['attendance_session_id' => $session1->id, 'user_id' => $student2->id],
            ['status' => 'present']
        );
        AttendanceRecord::updateOrCreate(
            ['attendance_session_id' => $session2->id, 'user_id' => $student2->id],
            ['status' => 'absent']
        );
    }
}
