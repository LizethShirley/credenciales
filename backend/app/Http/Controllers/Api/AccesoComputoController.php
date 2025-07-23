<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Crypt;

class AccesoComputoController extends Controller
{
    public function generarTokensQR(Request $request)
    {
        $request->validate([
            'personal_ids' => 'required|array',
            'personal_ids.*' => 'exists:personal,id',
        ]);

        $resultados = [];

        foreach ($request->personal_ids as $personal_id) {
            try {
                // Obtener datos personales
                $persona = Personal::findOrFail($personal_id);

                // Crear texto cifrado con id y ci
                $contenidoEncriptado = Crypt::encrypt([
                    'personal_id' => $persona->id,
                    'ci'          => $persona->ci,
                    'timestamp'   => now()->timestamp
                ]);

                // Generar QR
                $qr = QrCode::format('png')->size(250)->generate($contenidoEncriptado);

                // Guardar archivo
                $folderPath = "public/qr/{$persona->id}";
                $fileName = 'qr_' . now()->timestamp . '.png';
                Storage::put("{$folderPath}/{$fileName}", $qr);

                $qrBase64 = base64_encode($qr);

                // Guardar en base de datos
                $acceso = AccesoComputo::create([
                    'personal_id'    => $persona->id,
                    'token_acceso'   => $contenidoEncriptado, // Guardamos el string cifrado como "token"
                    'fecha_generado' => now(),
                    'activo'         => true,
                ]);

                $resultados[] = [
                    'personal_id' => $persona->id,
                    'res'         => true,
                    'msg'         => 'QR generado con datos cifrados',
                    'token'       => $contenidoEncriptado,
                    'qr_image'    => 'data:image/png;base64,' . $qrBase64,
                    'qr_path'     => Storage::url("{$folderPath}/{$fileName}"),
                ];

            } catch (\Exception $e) {
                $resultados[] = [
                    'personal_id' => $personal_id,
                    'res'         => false,
                    'msg'         => 'Error al generar QR',
                    'error'       => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'res'   => true,
            'datos' => $resultados
        ], 200);
    }
}
