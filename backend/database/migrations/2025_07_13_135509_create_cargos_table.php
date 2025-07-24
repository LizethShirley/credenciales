<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cargos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150);
            $table->integer('color')->default(1);
            $table->integer('estado');
            $table->unsignedBigInteger('idseccion');
            $table->timestamps();

            $table->foreign('idseccion')->references('id')->on('secciones')->onDelete('restrict');
        });

        $sqlFile = resource_path('db/cargos.sql');

        if (file_exists($sqlFile)) {
            DB::unprepared(file_get_contents($sqlFile));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargos');
    }
};
