# طراحی دیتابیس (Database Schema) - پروژه HomeStore

این سند شامل طراحی ساختار داده‌ها، نمودار موجودیت-رابطه (ERD) و توضیحات جداول برای دیتابیس فروشگاه آنلاین لوازم خانگی است.

## ۱. نمودار موجودیت-رابطه (ERD)

در این نمودار، موجودیت‌ها (Entities) و روابط (Relationships) بین آن‌ها نشان داده شده است. دیتابیس ما از نوع **PostgreSQL** (رابطه‌ای) خواهد بود.

![نمودار ERD](diagrams/erd-diagram.png)

*(در صورت نیاز به ویرایش، کد PlantUML این نمودار در انتهای همین فایل قرار دارد.)*

## ۲. توضیحات جداول و فیلدها (Data Dictionary)

### جدول: `Customer` (مشتریان)
اطلاعات کاربرانی که در فروشگاه ثبت‌نام می‌کنند و خرید انجام می‌دهند.
| نام فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | UUID (Primary Key) | شناسه یکتای مشتری |
| `first_name` | VARCHAR(50) | نام |
| `last_name` | VARCHAR(50) | نام خانوادگی |
| `phone` | VARCHAR(15) | شماره تماس (برای ارسال پیامک سفارش) |
| `email` | VARCHAR(100) | ایمیل (اختیاری) |
| `address` | TEXT | آدرس دقیق برای ارسال کالا |

### جدول: `Category` (دسته‌بندی‌ها)
دسته‌بندی محصولات (مثلاً: یخچال، لباسشویی، ظرفشویی).
| نام فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | UUID (Primary Key) | شناسه یکتای دسته |
| `title` | VARCHAR(50) | نام دسته‌بندی |
| `slug` | VARCHAR(50) | برای URL (مثلاً /category/refrigerator) |

### جدول: `Product` (محصولات)
اطلاعات کالاهای موجود در فروشگاه.
| نام فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | UUID (Primary Key) | شناسه یکتای محصول |
| `category_id` | UUID (Foreign Key) | ارجاع به جدول Category |
| `name` | VARCHAR(100) | نام محصول |
| `description` | TEXT | توضیحات و ویژگی‌های محصول (برای مقایسه) |
| `price` | DECIMAL(10,2) | قیمت به تومان/ریال |
| `stock` | INT | موجودی انبار |
| `warranty_months` | INT | مدت گارانتی به ماه (مثلاً 18) |

### جدول: `Order` (سفارش‌ها)
ثبت فاکتور نهایی خرید مشتری.
| نام فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | UUID (Primary Key) | شناسه یکتای سفارش |
| `customer_id` | UUID (Foreign Key) | ارجاع به مشتری ثبت‌کننده |
| `order_date` | TIMESTAMP | تاریخ و زمان دقیق ثبت سفارش |
| `total_price` | DECIMAL(10,2) | مبلغ کل فاکتور |
| `status` | VARCHAR(20) | وضعیت سفارش (Pending, Shipped, Delivered) |

### جدول: `OrderItem` (اقلام سفارش)
چون هر سفارش می‌تواند شامل چند محصول باشد، این جدول جزئیات را نگه می‌دارد.
| نام فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | UUID (Primary Key) | شناسه یکتا |
| `order_id` | UUID (Foreign Key) | ارجاع به جدول Order |
| `product_id` | UUID (Foreign Key) | ارجاع به جدول Product |
| `quantity` | INT | تعداد خریداری شده |
| `unit_price` | DECIMAL(10,2) | قیمت محصول در لحظه خرید (ممکن است بعداً تغییر کند) |

## ۳. نرمال‌سازی (Normalization)
طبق استانداردهای مهندسی نرم‌افزار، دیتابیس تا سطح **3NF** نرمال‌سازی شده است:
*   **1NF (حذف گروه‌های تکراری):** تمام فیلدها مقادیر اتمیک (تک‌مقداری) دارند. به جای ذخیره چند شماره تلفن در یک ستون، از یک ستون `phone` استفاده شده است.
*   **2NF (حذف وابستگی جزئی):** تمام فیلدهای غیرکلیدی کاملاً به کلید اصلی وابسته‌اند. به عنوان مثال، اطلاعات مشتری فقط در جدول `Customer` ذخیره شده و در جدول `Order` فقط `customer_id` قرار دارد.
*   **3NF (حذف وابستگی انتقالی):** اطلاعات دسته‌بندی (Category) مستقیماً به `Product` متصل است و فیلدهای غیرکلیدی به هم وابسته نیستند.

## ۴. کد PlantUML برای ویرایش نمودار ERD
*(این کد را می‌توانید در سایت plantuml.com کپی کنید تا نمودار را دوباره بسازید)*

```plantuml
@startuml
hide circle
skinparam linetype ortho

entity "Customer" {
  * id : UUID <<PK>>
  --
  first_name : VARCHAR
  last_name : VARCHAR
  phone : VARCHAR
  address : TEXT
}

entity "Order" {
  * id : UUID <<PK>>
  --
  customer_id : UUID <<FK>>
  order_date : TIMESTAMP
  total_price : DECIMAL
  status : VARCHAR
}

entity "Product" {
  * id : UUID <<PK>>
  --
  category_id : UUID <<FK>>
  name : VARCHAR
  description : TEXT
  price : DECIMAL
  stock : INT
  warranty_months : INT
}

entity "Category" {
  * id : UUID <<PK>>
  --
  title : VARCHAR
  slug : VARCHAR
}

entity "OrderItem" {
  * id : UUID <<PK>>
  --
  order_id : UUID <<FK>>
  product_id : UUID <<FK>>
  quantity : INT
  unit_price : DECIMAL
}

Customer ||--o{ Order : "ثبت می‌کند"
Order ||--|{ OrderItem : "شامل"
Product ||--o{ OrderItem : "در"
Category ||--o{ Product : "دارای"
@enduml
