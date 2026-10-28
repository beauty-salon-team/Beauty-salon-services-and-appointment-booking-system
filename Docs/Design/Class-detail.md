# نمودار کلاس‌ها (Class Diagram Details)
این دیاگرام ساختار اصلی سیستم سالن زیبایی را نشان می‌دهد.

## ۱. کلاس‌ها

### ۱.۱ User (کاربر)
کلاس پایه برای تمام کاربران سیستم.

| ویژگی (Attribute) | نوع (Type) |
| :--- | :--- |
| id | int |
| name | string |
| phone | string |
| password_hash | string |
| role | enum (Customer, Specialist, Admin) |

### ۱.۲ Customer (مشتری)
اطلاعات اختصاصی مشتریان.

| ویژگی (Attribute) | نوع (Type) |
| :--- | :--- |
| id | int |
| user_id | int (FK) |
| address | string |

### ۱.۳ Specialist (متخصص)
اطلاعات اختصاصی متخصصین سالن.

| ویژگی (Attribute) | نوع (Type) |
| :--- | :--- |
| id | int |
| user_id | int (FK) |
| specialty | string |
| working_hours_start | time |
| working_hours_end | time |

### ۱.۴ Service (خدمات)
خدماتی که در سالن ارائه می‌شود.

| ویژگی (Attribute) | نوع (Type) |
| :--- | :--- |
| id | int |
| title | string |
| description | string |
| price | decimal |
| duration_minutes | int |

### ۱.۵ Appointment (نوبت)
نوبت‌های رزرو شده در سیستم.

| ویژگی (Attribute) | نوع (Type) |
| :--- | :--- |
| id | int |
| customer_id | int (FK) |
| specialist_id | int (FK) |
| service_id | int (FK) |
| appointment_date | datetime |
| status | enum (Pending, Confirmed, Cancelled, Completed) |

### ۱.۶ Review (نظرات)
نظرات و امتیازاتی که مشتریان ثبت می‌کنند.

| ویژگی (Attribute) | نوع (Type) |
| :--- | :--- |
| id | int |
| customer_id | int (FK) |
| specialist_id | int (FK) |
| rating | int (1 to 5) |
| comment | string |
| created_at | datetime |

---

## ۲. روابط (Relationships)

*   **User 1:1 Customer** (هر کاربر مشتری، یک پروفایل مشتری دارد)
*   **User 1:1 Specialist** (هر کاربر متخصص، یک پروفایل متخصص دارد)
*   **Customer 1:N Appointment** (هر مشتری می‌تواند چندین نوبت داشته باشد)
*   **Specialist 1:N Appointment** (هر متخصص می‌تواند چندین نوبت داشته باشد)
*   **Service 1:N Appointment** (هر خدمت می‌تواند در چندین نوبت رزرو شود)
*   **Customer 1:N Review** (هر مشتری می‌تواند چندین نظر ثبت کند)
*   **Specialist 1:N Review** (هر متخصص می‌تواند چندین نظر دریافت کند)
