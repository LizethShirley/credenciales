<?php

namespace App\Http\Controllers\Api;

use App\Models\AccesoComputoExterno;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AccesoComputoExternoController extends Controller
{
    public function generateQRExterno($type)
    {
        if (!in_array($type, ['prensa', 'observador', 'candidato', 'delegado', 'publico'])) {
            return response()->json(['msg' => 'Tipo inválido'], 400);
        }

        $code = Str::upper(Str::random(10));
        $qrData = url("/externo/{$code}");
        $qr = QrCode::format('svg')->size(pixels: 250)->generate($qrData);

        $codigoBarra = DNS1D::getBarcodeSVG($qrData, 'C128', 2, 70, false);

        $fileName = 'qr_' . $code . '.svg';
        $fileNameBC = 'bc_' . $code . '.svg';

        Storage::put("public/qr/{$fileName}", $qr);
        Storage::put("public/barcode/{$fileNameBC}", $codigoBarra);

        $accessCode = AccesoComputoExterno::create([
            'token_access' => $code,
            'tipo' => $type,
            'activo' => true,
            'qr' => $qr,
            'barcode' => $codigoBarra
        ]);

        $resultados[] = [
            'res' => true,
            'msg' => 'QR generado y guardado',
            'code' => $code,
        ];

        return response()->json([
            'res' => true,
            'datos' => $resultados
        ]);
    }

    public function verify($code)
    {
        $accessCode = AccesoComputoExterno::where('token_access', $code)
            ->where('activo', true)
            ->first();

        if ($accessCode) {
            return response()->json([
                'res' => true,
                'msg' => 'Acceso permitido',
                'type' => $accessCode->tipo,
                'status' => 200
            ]);
        }

        return response()->json([
            'res' => false,
            'msg' => 'Acceso denegado',
            'status' => 403
        ]);
    }

    public function generateQRExternoMasivo(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:prensa,observador,candidato,delegado,publico',
            'cantidad' => 'required|integer|min:1|max:1000'
        ]);

        $type = $request->input('tipo');
        $cantidad = $request->input('cantidad');
        $resultados = [];

        for ($i = 0; $i < $cantidad; $i++) {
            $code = Str::upper(Str::random(5));
            $qrData = "externo/{$code}";

            $qr = QrCode::format('svg')->size(250)->generate($qrData);
            $codigoBarra = DNS1D::getBarcodeSVG($qrData, 'C128', 2, 70, false);

            $fileNameQR = "qr_{$code}.svg";
            $fileNameBC = "bc_{$code}.svg";

            Storage::put("public/qr/{$fileNameQR}", $qr);
            Storage::put("public/barcode/{$fileNameBC}", $codigoBarra);

            AccesoComputoExterno::create([
                'token_acceso' => $code,
                'tipo' => $type,
                'qr' => $qr,
                'barcode' => $codigoBarra,
                'activo' => true,
            ]);

            $resultados[] = [
                'token_access' => $code,
                'tipo' => $type,
                'qr' => $qr ? base64_encode($qr) : null,
                'barcode' => $codigoBarra ? base64_encode($codigoBarra) : null,
            ];
        }

        return response()->json([
            'res' => true,
            'msg' => "Se generaron {$cantidad} accesos",
            'datos' => $resultados
        ]);
    }

    public function listarAccesosExternos()
    {
        $accesos = DB::table('acceso_computo_externo as a')
                ->select(
                    'a.id',
                    'a.tipo',
                    'a.activo',
                    'a.qr',
                    'a.barcode',
                    'a.created_at',
                    'a.updated_at'
                )
                ->orderBy('a.created_at', 'desc')
                ->get();

        $accesosArray = $accesos->map(function ($acceso) {
            $arrayAcceso = (array) $acceso;
            $arrayAcceso['qr'] = $acceso->qr ? base64_encode($acceso->qr) : null;
            $arrayAcceso['barcode'] = $acceso->barcode ? base64_encode($acceso->barcode) : null;
            return $arrayAcceso;
        });
        return response()->json([
            'res' => true,
            'datos' => $accesosArray
        ]);
    }
}
