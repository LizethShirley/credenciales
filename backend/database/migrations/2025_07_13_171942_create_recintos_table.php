<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recintos', function (Blueprint $table) {
            $table->id();
            $table->integer('codigoMesa')->nullable();
            $table->integer('codigoActa')->nullable();
            $table->bigInteger('numMesa')->nullable();
            $table->integer('numeroMesa')->nullable();
            $table->integer('idPais')->nullable();
            $table->string('nomPais', 7)->nullable();
            $table->integer('dep')->nullable();
            $table->string('nombreDepartamento', 10)->nullable();
            $table->integer('prov')->nullable();
            $table->string('nombreProvincia', 40)->nullable();
            $table->integer('circun')->nullable();
            $table->string('nomCircun', 10)->nullable();
            $table->integer('sec')->nullable();
            $table->string('nombreMunicipio', 40)->nullable();
            $table->integer('codigoLocalidad')->nullable();
            $table->string('nombreLocalidad', 53)->nullable();
            $table->integer('dist')->nullable();
            $table->string('nomDist', 40)->nullable();
            $table->integer('zona')->nullable();
            $table->string('nomZona', 48)->nullable();
            $table->integer('codigoRecinto')->nullable();
            $table->string('nombreRecinto', 69)->nullable();
            $table->integer('ciNotE')->nullable();
            $table->string('nomNotE', 50)->nullable();
            $table->integer('inscritosHabilitados')->nullable();
            $table->integer('idTipoMesa')->nullable();
            $table->integer('idEstadoMesaGeografia')->nullable();
            $table->string('fechaRegistro', 7)->nullable();
            $table->integer('estadoRegistro')->nullable();
            $table->string('observaciones', 250);
            $table->timestamps();
        });

        $sqlFile = resource_path('db/recintos.sql');

        if (file_exists($sqlFile)) {
            DB::unprepared(file_get_contents($sqlFile));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('recintos');
    }
};

