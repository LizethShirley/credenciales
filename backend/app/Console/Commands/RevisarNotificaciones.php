<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Personal;
use App\Models\Notificacion;
use App\Notifications\PersonalNotificacion;

class RevisarNotificaciones extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    // protected $signature = 'app:revisar-notificaciones';
    protected $signature = 'personal:revisar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Detecta personales nuevos o actualizados con impreso = 0 y crea notificaciones';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1️⃣ Solo revisamos los que no están impresos
        $personales = Personal::where('estado', 0)->get();

        if ($personales->isEmpty()) {
            $this->info('No hay personales nuevos o actualizados sin imprimir.');
            return;
        }

        $admins = User::get();

        $nuevos = collect();
        $actualizados = collect();

        foreach ($personales as $p) {
            $registro = Notificacion::where('personal_id', $p->id)->first();

            if (!$registro) {
                // Es nuevo
                $nuevos->push($p);
                Notificacion::create([
                    'personal_id' => $p->id,
                    'ultima_actualizacion' => $p->updated_at,
                ]);
            } elseif ($p->updated_at > $registro->ultima_actualizacion) {
                // Es actualizado
                $actualizados->push($p);
                $registro->update(['ultima_actualizacion' => $p->updated_at]);
            }
        }

        // 2️⃣ Enviar notificaciones
        foreach ($admins as $admin) {
            foreach ($nuevos as $p) {
                $admin->notify(new PersonalNotificacion($p, 'nuevo'));
            }
            foreach ($actualizados as $p) {
                $admin->notify(new PersonalNotificacion($p, 'actualizado'));
            }
        }
        $this->info("Nuevos: {$nuevos->count()} | Actualizados: {$actualizados->count()}");
    }
}
