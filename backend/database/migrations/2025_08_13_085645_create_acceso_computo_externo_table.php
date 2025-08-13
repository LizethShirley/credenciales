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
        Schema::create('acceso_computo_externo', function (Blueprint $table) {
            $table->id();
            $table->string('token_acceso')->unique();
            $table->enum('tipo', ['prensa', 'observador', 'candidato']);
            $table->longText('qr')->nullable();
            $table->longText('barcode')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acceso_computo_externo');
    }
};
