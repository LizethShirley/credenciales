<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('registro_accesos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('acceso_computo_id'); // Relación con credencial
            $table->enum('tipo', ['entrada', 'salida']);
            $table->timestamp('fecha_hora')->useCurrent();
            $table->timestamps();

            $table->foreign('acceso_computo_id')->references('id')->on('acceso_computos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_accesos');
    }
};
