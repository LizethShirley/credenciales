<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('observadores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_completo');       
            $table->string('ci')->unique()->nullable();          
            $table->binary('foto')->nullable();
            $table->string('identificador')->nullable(); 
            $table->string('organizacion_politica')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('observadores');
    }
};
