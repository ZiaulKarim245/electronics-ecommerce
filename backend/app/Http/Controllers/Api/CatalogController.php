<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->with('children')
            ->where('is_active', true)
            ->whereNull('parent_id')          // top-level only
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id'             => $category->id,
                'name'           => $category->name,
                'slug'           => $category->slug,
                'icon'           => $category->icon,
                'children_count' => $category->children->count(),
                'children'       => $category->children
                    ->where('is_active', true)
                    ->map(fn (Category $child) => [
                        'id'   => $child->id,
                        'name' => $child->name,
                        'slug' => $child->slug,
                        'icon' => $child->icon,
                    ])->values(),
            ]);

        return response()->json([
            'status' => 'success',
            'data'   => $categories,
        ]);
    }

    public function featured(): JsonResponse
    {
        $products = Product::query()
            ->with(['brand', 'category', 'specifications', 'variants'])
            ->where('is_active', true)
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn (Product $product) => $this->transformProduct($product))
            ->values();

        return response()->json([
            'status' => 'success',
            'data'   => $products,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['brand', 'category', 'specifications', 'variants'])
            ->where('is_active', true);

        if ($request->filled('q')) {
            $searchTerm = (string) $request->query('q');
            $query->where(function ($search) use ($searchTerm) {
                $search->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('model', 'like', "%{$searchTerm}%")
                    ->orWhereHas('brand', fn ($brand) => $brand->where('name', 'like', "%{$searchTerm}%"));
            });
        }

        if ($request->filled('category')) {
            $category = (string) $request->query('category');
            $query->whereHas('category', fn ($categoryQuery) => $categoryQuery->where('slug', $category));
        }

        $products = $query->orderByDesc('id')->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $products->through(fn (Product $product) => $this->transformProduct($product)),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['brand', 'category', 'specifications', 'variants'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $this->transformProduct($product),
        ]);
    }

    private function transformProduct(Product $product): array
    {
        $official = $product->variants->firstWhere('warranty_type', 'Official') ?? $product->variants->first();
        $shop = $product->variants->firstWhere('warranty_type', 'Shop') ?? $official;
        $stockQuantity = $product->variants->sum('stock_quantity');

        return [
            'id'                  => $product->id,
            'slug'                => $product->slug,
            'title'               => $product->title,
            'model'               => $product->model,
            'brand'               => $product->brand?->name,
            'category'            => $product->category?->name,
            'stock_status'        => $product->is_preorder ? 'Pre-Order' : ($stockQuantity > 0 ? 'In Stock' : 'Out of Stock'),
            'official_warranty'   => $official ? [
                'price'         => (float) $official->regular_price,
                'regular_price' => round((float) $official->regular_price * 1.08),
                'duration'      => $official->warranty_duration,
            ] : null,
            'shop_warranty'       => $shop ? [
                'price'         => (float) $shop->regular_price,
                'regular_price' => round((float) $shop->regular_price * 1.06),
                'duration'      => $shop->warranty_duration,
            ] : null,
            'key_features'        => $product->specifications->take(4)->map(fn ($specification) => $specification->spec_value)->values(),
            'specifications'      => $product->specifications->map(fn ($specification) => [
                'group' => $specification->spec_group,
                'key'   => $specification->spec_key,
                'value' => $specification->spec_value,
            ])->values(),
            'video_url'           => $product->video_url,
            'driver_download_url' => $product->driver_download_url,
            'visual_type'         => $product->category?->icon ?? 'gpu',
        ];
    }
}
