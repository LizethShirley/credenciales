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
        Schema::create('acceso_computo_observadores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('token_id');
            $table->unsignedBigInteger('observador_id');
            $table->timestamp('asignado')->default(now());
            $table->timestamp('liberado')->nullable();

            $table->foreign('token_id')->references('id')->on('acceso_computo_externo')->onDelete('set null');
            $table->foreign('observador_id')->references('id')->on('observadores')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acceso_computo_observadores');
    }
};
