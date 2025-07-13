<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonalsTable extends Migration
{
    public function up(): void
    {
        Schema::create('personal', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('paterno', 120)->nullable();
            $table->string('materno', 120)->nullable();
            $table->binary('photo')->nullable(); // imagen binaria (BLOB)
            $table->unsignedBigInteger('id_cargo')->nullable();
            $table->string('ci', 25)->nullable();
            $table->integer('estado')->default(1);
            $table->string('complemento', 5)->nullable();
            $table->string('extencion', 25)->nullable();
            $table->unsignedBigInteger('id_recinto')->nullable();
            $table->string('token', 100)->nullable();
            $table->string('email', 25)->nullable();
            $table->integer('celular')->default(72788524);
            $table->integer('accesoComputo')->default(0);
            $table->string('ciexterno', 45)->nullable();
            $table->timestamps();

            // Opcional: claves foráneas (descomenta si ya tienes las tablas)
            // $table->foreign('id_cargo')->references('id')->on('cargos')->onDelete('restrict');
            // $table->foreign('id_recinto')->references('id')->on('recintos')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal');
    }
}
