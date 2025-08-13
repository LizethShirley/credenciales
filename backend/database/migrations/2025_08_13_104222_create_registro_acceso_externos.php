<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registro_acceso_externos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('acceso_computo_externo_id')->constrained('acceso_computo_externo')->onDelete('cascade'); // ✅ correcta
            $table->enum('tipo', ['entrada', 'salida']);
            $table->timestamp('fecha_hora')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_acceso_externos');
    }
};
