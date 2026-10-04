# Software Requirement Specification (SRS)
## Project: Electronics, Gadgets & Computer Hardware E-Commerce Platform

**Target Market:** Bangladesh (Smartphones, Laptops, PC Components, Smart Gadgets, Accessories)
**Architecture:** Decoupled Full-Stack Architecture (Next.js Storefront/Business Portal + Laravel REST API Backend)

### 1. Executive Summary & Domain Overview
The objective of this project is to build a robust, high-performance e-commerce platform specifically tailored for Bangladeshi electronics, gadget, and computer hardware retailers. Unlike apparel, electronics retail in Bangladesh demands specialized technical specifications, multi-tier warranty tracking (Official Brand Warranty vs. Shop/Replacement Warranty), serial number (IMEI / Serial No.) tracking for anti-fraud, PC Builder/Custom Configurator tools, and high-value payment verification workflows (Advance delivery charge verification, SSLCommerz EMI, and bKash tokenized gateway).

### 2. Technology Stack & Architecture
- **Storefront & Business Portal:** Next.js 14+ (App Router, Server-Side Rendering (SSR) / Incremental Static Regeneration (ISR), TypeScript, Tailwind CSS, Zustand / Redux Toolkit).
- **Backend REST API:** Laravel 13 (Resource Controllers, Form Requests, Sanctum Auth, Eloquent ORM, Spatie Laravel-Permission).
- **Database & Caching:** MySQL 8.0+ with Redis for queue handling (SMS, Courier Webhooks, Meta CAPI events) and query caching.
- **Storage:** AWS S3 / DigitalOcean Spaces / Local Storage with WebP image conversion pipeline.

### 3. Detailed Functional Requirements

#### 3.1 Customer-Facing Storefront (Next.js)
- **Technical Specifications & Dynamic Comparison:** Structured technical key-value attributes (RAM, Storage, Processor, GPU, Battery, Display type) with a side-by-side product comparison tool (up to 4 devices).
- **Interactive Custom PC Builder:** Component compatibility engine (CPU ↔ Motherboard socket match, RAM type DDR4/DDR5, PSU wattage calculator) with direct 'Add All to Cart' or 'Export Build / Print Quotation' feature.
- **Warranty Selection & Verification:** Distinct price toggles for 'Official Warranty' vs. 'Shop Warranty / Global Variant', plus a public Serial/IMEI warranty validation lookup tool.
- **Product Detail Page (PDP):** Stock availability indicators ('In Stock', 'Pre-Order', 'Out of Stock', 'Upcoming'), video unboxing tab, downloadable driver/manual links, and customer reviews with rating breakdown.
- **Checkout & Advance Payment for High-Value Orders:** 1-page express checkout with logic enforcing advance delivery charge payment (via bKash/Nagad) for high-value electronic parcels outside Dhaka before order confirmation.
- **Customer Account & RMA Portal:** OTP-based login, order tracking timeline, invoice download, and return/warranty claim (RMA) ticket submission.
- **Marketing & Real-Time Tracking:** Meta Pixel, Server-Side Conversion API (CAPI) events with product content IDs, Google Tag Manager (GTM) data layer, and WhatsApp direct consultation widget.

#### 3.2 Business & Operations Portal (Next.js / Laravel API)
- **Inventory & Serial/IMEI Tracking:** Dynamic spec matrix (e.g., 8GB/128GB, 12GB/256GB, Color, Region Variant) with individual serial number / IMEI assignment upon inventory intake and billing.
- **Order Processing & High-Value Fraud Shield:** Automated flagging of risky orders based on courier return ratios and blacklisted phone numbers. Order editing (swap variant, apply manual discount, adjust advance payment) prior to shipping.
- **Incomplete Order Recovery:** Live tracking of abandoned checkouts with one-click call/WhatsApp trigger.
- **Physical Store POS & Quotation Generator:** Counter checkout module with barcode/IMEI scanner, thermal receipt printing (58mm/80mm), and instant PDF price quotation generator for walk-in retail clients.
- **Warranty & RMA Management:** Service ticket tracking for repairs, replacements, and claims sent to official brand distributor service centers.
- **Promotional Landing Page Builder:** Custom landing page manager for gadget flash sales and pre-order campaigns (/offer/{slug}) with built-in countdown timers and express order forms.
- **Role-Based Access Control (RBAC):** Granular permissions for Admin, Inventory Manager, Technician / RMA Officer, Salesman (POS), and Accountant.
- **Financial Accounting & Reporting:** Accurate profit margin calculation (Cost of Goods Sold vs. Selling Price), daily POS cash register settlement, operating expense logger, and CSV/Excel export.

#### 3.3 Local Bangladeshi Third-Party Integrations
- **Couriers:** Steadfast Courier API and Pathao Courier API integration (automated parcel creation, delivery charge calculation, and webhook status listeners).
- **Payment Gateways:** Cash on Delivery (COD), bKash Tokenized/Direct Checkout, SSLCommerz (Card, Nagad, Rocket, EMI support for high-value purchases).
- **SMS Gateways:** Transactional SMS alerts for Order Confirmation, Advance Payment Received, Dispatch with Tracking URL, and Service Center RMA updates.

### 4. Core Database Schema Design
Table Name
Primary Purpose
Key Fields & Relationships
 
products
Master electronic catalog
id, title, slug, brand_id, category_id, model, video_url, is_preorder, is_active

product_specifications
Technical specs for PC builder & comparison
id, product_id, spec_group (e.g. Memory), spec_key (e.g. RAM Type), spec_value (e.g. DDR5)

product_variants
Hardware variants (Storage/RAM/Color/Warranty)
id, product_id, sku, barcode, warranty_type, warranty_duration, regular_price, cogs_price, stock_quantity

product_serials
IMEI / Serial number tracking per unit
id, product_variant_id, serial_or_imei, status (available, sold, rma_claimed), order_item_id

orders
Sales transactions & advance payments
id, invoice_no, customer_id, customer_name, phone, address, district, total_amount, advance_paid, due_amount, payment_method, payment_status, order_status, courier_name, tracking_code

order_items
Ordered items with linked serial numbers
id, order_id, product_id, product_variant_id, quantity, unit_price, assigned_serials (JSON)

rma_claims
Warranty claims and servicing records
id, serial_number, customer_id, problem_description, status (Received, In-Inspection, Sent to Brand, Resolved, Returned), resolution_notes

incomplete_orders
Abandoned gadget checkouts
id, phone, customer_name, cart_data (JSON), ip_address, status


### 5. 8-Week Intern Implementation Plan
- **Phase 1 (Week 1-2):** Database architecture, Technical Specifications CRUD, and Next.js Catalog Laravel migrations & API for electronics specs, variant pricing, Next.js product catalog, faceted hardware filter.
- **Phase 2 (Week 3-4):** Comparison, PC Builder tool, OTP-based customer auth ,Cart, Express Checkout, & Advance Payment Logic
Side-by-side comparison page, Interactive Next.js PC builder component, OTP-based customer auth ,incomplete checkout capture, single-page checkout supporting partial advance payment calculation, and order tracking.
- **Phase 3 (Week 5-6):** Local BD Gateways & Serial/IMEI Inventory Tracking
Steadfast & Pathao courier APIs, bKash/SSLCommerz integrations, SMS gateway notifications, and IMEI/Serial inventory attachment during fulfillment.
- **Phase 4 (Week 7-8):** POS & Quotations, RMA Warranty Module, Landing Pages, & CAPI
Retail POS interface, instant PDF quotation export, warranty claim management portal, Meta CAPI tracking, Spatie RBAC setup (Admin authentication), and final QA.


