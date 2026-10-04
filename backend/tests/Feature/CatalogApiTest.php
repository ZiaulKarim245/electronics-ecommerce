<?php

namespace Tests\Feature;

use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.frontend.key' => 'test-frontend-key']);
        $this->seed(CatalogSeeder::class);
    }

    public function test_catalog_requires_the_frontend_key(): void
    {
        $this->getJson('/api/products')->assertUnauthorized();
    }

    public function test_catalog_returns_storefront_products(): void
    {
        $this->withHeader('X-Frontend-Key', 'test-frontend-key')
            ->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(4, 'data.data')
            ->assertJsonPath('data.data.0.visual_type', 'monitor');
    }

    public function test_catalog_can_return_a_product_by_slug(): void
    {
        $this->withHeader('X-Frontend-Key', 'test-frontend-key')
            ->getJson('/api/products/amd-ryzen-7-7800x3d-am5-processor')
            ->assertOk()
            ->assertJsonPath('data.brand', 'AMD')
            ->assertJsonPath('data.category', 'Processor');
    }
}
