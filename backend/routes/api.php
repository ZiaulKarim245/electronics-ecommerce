<?php

use App\Http\Controllers\Api\CatalogController;
use Illuminate\Support\Facades\Route;

Route::middleware('frontend.key')->group(function () {
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'service' => config('app.name'),
        ]);
    });

    // Catalog endpoints
    Route::get('/categories', [CatalogController::class, 'categories']);
    Route::get('/products', [CatalogController::class, 'index']);
    Route::get('/products/featured', [CatalogController::class, 'featured']); // Must be before /{slug}
    Route::get('/products/{slug}', [CatalogController::class, 'show']);
});
