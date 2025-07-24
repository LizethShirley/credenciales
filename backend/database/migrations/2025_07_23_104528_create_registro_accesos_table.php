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
            $table->foreignId('acceso_computo_id')->constrained('acceso_computo')->onDelete('cascade'); // ✅ correcta
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
        Schema::dropIfExists('registro_accesos');
    }
};

