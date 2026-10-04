<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'brand' => ['name' => 'NVIDIA', 'slug' => 'nvidia'],
                'category' => ['name' => 'Graphics Card', 'slug' => 'graphics-card', 'icon' => 'gpu'],
                'title' => 'NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X Gaming Graphics Card',
                'slug' => 'geforce-rtx-4070-super-12gb',
                'model' => 'RTX-4070-SUP-12G',
                'is_preorder' => false,
                'features' => [
                    ['GPU Engine Specs', 'CUDA Cores', '7168 CUDA cores with Ada Lovelace architecture'],
                    ['GPU Engine Specs', 'Boost Clock', '2475 MHz boost clock'],
                    ['Memory Specs', 'Memory', '12GB GDDR6X 192-bit high-speed VRAM'],
                    ['Thermal & Power', 'Recommended PSU', '650W recommended power supply'],
                ],
                'variants' => [
                    ['RTX4070S-OFF', 'Official', '3 Years Official Distributor Warranty', 79500, 8],
                    ['RTX4070S-SHOP', 'Shop', '2 Years Shop Warranty', 74000, 5],
                ],
            ],
            [
                'brand' => ['name' => 'AMD', 'slug' => 'amd'],
                'category' => ['name' => 'Processor', 'slug' => 'processor', 'icon' => 'cpu'],
                'title' => 'AMD Ryzen 7 7800X3D 8-Core 16-Thread AM5 Gaming Processor',
                'slug' => 'amd-ryzen-7-7800x3d-am5-processor',
                'model' => '100-100000910WOF',
                'is_preorder' => false,
                'features' => [
                    ['CPU Specifications', 'Core Count', '8 cores and 16 threads for high-end gaming'],
                    ['CPU Specifications', 'Cache', '104MB combined cache with 3D V-Cache'],
                    ['Platform Support', 'Socket', 'Socket AM5 with PCIe 5.0 and DDR5 support'],
                    ['Thermal & Power', 'TDP', '120W TDP with up to 5.0GHz boost clock'],
                ],
                'variants' => [
                    ['7800X3D-OFF', 'Official', '3 Years Official Brand Warranty', 44999, 14],
                    ['7800X3D-SHOP', 'Shop', '1 Year Replacement Warranty', 41500, 6],
                ],
            ],
            [
                'brand' => ['name' => 'Apple', 'slug' => 'apple'],
                'category' => ['name' => 'Laptop', 'slug' => 'laptop', 'icon' => 'laptop'],
                'title' => 'Apple MacBook Pro 16-inch M3 Pro, 18GB RAM, 512GB SSD',
                'slug' => 'apple-macbook-pro-16-m3-pro',
                'model' => 'MRW13LL/A',
                'is_preorder' => false,
                'features' => [
                    ['Processor', 'Chip', 'Apple M3 Pro with 12-core CPU and 18-core GPU'],
                    ['Display', 'Panel', '16.2-inch Liquid Retina XDR with 120Hz ProMotion'],
                    ['Memory & Storage', 'Configuration', '18GB unified memory and 512GB NVMe SSD'],
                    ['Battery & Power', 'Battery Life', 'Up to 22 hours battery life'],
                ],
                'variants' => [
                    ['MBP16-M3P-OFF', 'Official', '1 Year Apple International Warranty', 298000, 4],
                    ['MBP16-M3P-SHOP', 'Shop', '1 Year Shop Service Warranty', 285000, 3],
                ],
            ],
            [
                'brand' => ['name' => 'Samsung', 'slug' => 'samsung'],
                'category' => ['name' => 'Monitor', 'slug' => 'monitor', 'icon' => 'monitor'],
                'title' => 'Samsung Odyssey OLED G8 34-inch UWQHD 175Hz Curved Gaming Monitor',
                'slug' => 'samsung-odyssey-oled-g8-34-curved',
                'model' => 'LS34BG850SNXZA',
                'is_preorder' => true,
                'features' => [
                    ['Display Specs', 'Panel', '34-inch 1800R curved Quantum OLED panel'],
                    ['Display Specs', 'Resolution', '3440 × 1440 Ultra-Wide QHD resolution'],
                    ['Display Specs', 'Refresh Rate', '175Hz refresh rate with 0.03ms response time'],
                    ['Connectivity', 'Ports', 'Micro HDMI 2.1, Mini DisplayPort and USB-C'],
                ],
                'variants' => [
                    ['G8-OLED-OFF', 'Official', '3 Years Official Samsung Warranty', 132000, 0],
                    ['G8-OLED-SHOP', 'Shop', '1 Year Shop Warranty', 124000, 0],
                ],
            ],
        ];

        foreach ($products as $item) {
            $brand = Brand::updateOrCreate(['slug' => $item['brand']['slug']], $item['brand']);
            $category = Category::updateOrCreate(['slug' => $item['category']['slug']], $item['category']);
            $product = Product::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'brand_id' => $brand->id,
                    'category_id' => $category->id,
                    'model' => $item['model'],
                    'is_preorder' => $item['is_preorder'],
                    'is_active' => true,
                ],
            );

            $product->specifications()->delete();
            foreach ($item['features'] as [$group, $key, $value]) {
                $product->specifications()->create([
                    'spec_group' => $group,
                    'spec_key' => $key,
                    'spec_value' => $value,
                ]);
            }

            foreach ($item['variants'] as [$sku, $warrantyType, $warrantyDuration, $price, $stock]) {
                $product->variants()->updateOrCreate(
                    ['sku' => $sku],
                    [
                        'warranty_type' => $warrantyType,
                        'warranty_duration' => $warrantyDuration,
                        'regular_price' => $price,
                        'cogs_price' => 0,
                        'stock_quantity' => $stock,
                    ],
                );
            }
        }
    }
}
