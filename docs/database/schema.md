# Database Schema Design

This document defines the core data entities for the REC platform.

## 1. Core Entities

### Company (User/Stakeholder)
- `id`: UUID
- `role`: Enum (Supplier, Buyer, Logistics, Admin)
- `name_fa`, `name_ru`, `name_en`: String
- `country`: String
- `kyb_status`: Boolean (Verified/Pending)

### Product
- `id`: UUID
- `hs_code`: String (e.g., "080410" for Dates)
- `title_fa`, `title_ru`, `title_en`: String
- `base_price_range`: Decimal
- `category`: String

### RFQ (Request for Quotation)
- `id`: UUID
- `buyer_id`: Relation (Company)
- `product_id`: Relation (Product)
- `quantity`: Float
- `incoterm`: String (e.g., FOB, CFR)
- `status`: Enum (Draft, Submitted, Validated, Quoted, Closed)
- `created_at`: Timestamp
