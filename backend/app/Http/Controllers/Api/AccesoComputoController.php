<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccesoComputo;
use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;


class AccesoComputoController extends Controller
{
    /**
     * Generar QR con el CI de cada persona.
     */
    public function generarTokenQR(Request $request)
    {
        $request->validate([
            'personal_ids' => 'required|array',
            'personal_ids.*' => 'exists:personal,id',
            'accesoComputo' => 'required',
        ]);

        $resultados = [];

        foreach ($request->personal_ids as $personal_id) {
            try {
                $persona = Personal::findOrFail($personal_id);
                $ci = $persona->ci;
                $accesoComputo = $request->input('accesoComputo');

                $persona->accesoComputo = $accesoComputo;
                $persona->save();

                $acceso = AccesoComputo::where('personal_id', $persona->id)->first();

                if ($acceso) {
                    $acceso->activo = $accesoComputo == '1';
                    $acceso->save();

                    $resultados[] = [
                        'personal_id' => $persona->id,
                        'res'         => false,
                        'msg'         => 'Ya existe un token para este CI, no se generó uno nuevo',
                        'ci'          => $ci,
                    ];
                    continue;
                }

                $randomString = time();
                $token = $ci . '-' . $randomString;

                $qr = QrCode::format('svg')->size(250)->generate($token);
                $codigoBarra = DNS1D::getBarcodeSVG($token, 'C128', 2, 70, false);

                $fileName = 'qr_ci_' . $ci . '.svg';
                $fileNameBC = 'bc_ci_' . $ci . '.svg';

                Storage::put("public/qr/{$fileName}", $qr);
                Storage::put("public/barcode/{$fileNameBC}", $codigoBarra);

                AccesoComputo::create([
                    'personal_id'    => $persona->id,
                    'token_acceso'   => $token,
                    'activo'         => true,
                    'qr'             => $qr,
                    'barcode'        => $codigoBarra,
                ]);

                $qrBase64 = base64_encode($qr);
                $bcBase64 = base64_encode($codigoBarra);

                $resultados[] = [
                    'personal_id' => $persona->id,
                    'res'         => true,
                    'msg'         => 'QR generado y guardado',
                    'ci'          => $ci,
                    // 'qr_image'    => 'data:image/png;base64,' . $qrBase64,
                    // 'qr_url'      => asset("storage/qr/{$fileName}"),
                    // 'bc_image'    => 'data:image/png;base64,' . $bcBase64,
                    // 'bc_url'      => asset("storage/barcode/{$fileNameBC}"),
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
        ]);
    }
}
