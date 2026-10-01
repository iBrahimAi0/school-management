<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\StudentParent;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum("blood_type",["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
            $table->foreignIdFor(StudentParent::class)->nullable()->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->drop("blood_type");
            $table->dropForeignIdFor(StudentParent::class);
        });
    }
};
