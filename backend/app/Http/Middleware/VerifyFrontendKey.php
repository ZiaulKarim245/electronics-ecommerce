<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyFrontendKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $expectedKey = (string) config('services.frontend.key');
        $providedKey = (string) $request->header('X-Frontend-Key');

        if ($expectedKey === '' || ! hash_equals($expectedKey, $providedKey)) {
            return new JsonResponse(['message' => 'Unauthorized frontend client.'], 401);
        }

        return $next($request);
    }
}
