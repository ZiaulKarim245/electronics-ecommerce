<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Brands Table
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Products Table (SRS 4.0)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('model')->nullable();
            $table->string('video_url')->nullable(); // Unboxing video embed
            $table->string('driver_download_url')->nullable();
            $table->boolean('is_preorder')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Product Specifications Table (SRS 4.0 for PC Builder & Comparison)
        Schema::create('product_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('spec_group'); // e.g. "GPU Engine Specs", "Memory"
            $table->string('spec_key');   // e.g. "CUDA Cores", "Boost Clock"
            $table->string('spec_value'); // e.g. "7168", "2475 MHz"
            $table->timestamps();
        });

        // 5. Product Variants Table (SRS 4.0: Hardware Variants & Warranty Tiers)
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->string('barcode')->nullable();
            $table->string('warranty_type'); // "Official" or "Shop"
            $table->string('warranty_duration'); // e.g. "3 Years"
            $table->decimal('regular_price', 12, 2);
            $table->decimal('cogs_price', 12, 2)->default(0); // Cost of Goods Sold for profit margin
            $table->integer('stock_quantity')->default(0);
            $table->timestamps();
        });

        // 6. Product Serials / IMEI Table (SRS 4.0 Anti-Fraud Unit Tracking)
        Schema::create('product_serials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->string('serial_or_imei')->unique();
            $table->enum('status', ['available', 'sold', 'rma_claimed'])->default('available');
            $table->unsignedBigInteger('order_item_id')->nullable();
            $table->timestamps();
        });

        // 7. Orders Table (SRS 4.0: Sales & Partial Advance Payments)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('customer_name');
            $table->string('phone');
            $table->text('address');
            $table->string('district'); // "Dhaka" or "Outside Dhaka"
            $table->decimal('total_amount', 12, 2);
            $table->decimal('advance_paid', 12, 2)->default(0);
            $table->decimal('due_amount', 12, 2);
            $table->string('payment_method')->default('COD');
            $table->string('payment_status')->default('pending');
            $table->string('order_status')->default('pending'); // pending, verified, dispatched, delivered, cancelled
            $table->string('courier_name')->nullable(); // Steadfast / Pathao
            $table->string('tracking_code')->nullable();
            $table->timestamps();
        });

        // 8. Order Items Table (SRS 4.0)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('product_variant_id')->constrained('product_variants');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->json('assigned_serials')->nullable(); // Bound unit serials
            $table->timestamps();
        });

        // 9. RMA Claims Table (SRS 4.0)
        Schema::create('rma_claims', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_no')->unique();
            $table->string('serial_number');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('customer_phone')->nullable();
            $table->text('problem_description');
            $table->enum('status', ['Received', 'In-Inspection', 'Sent to Brand', 'Resolved', 'Returned'])->default('Received');
            $table->text('resolution_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rma_claims');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('product_serials');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_specifications');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
    }
};
