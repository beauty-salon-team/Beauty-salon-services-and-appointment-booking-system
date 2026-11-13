# Class Diagram — سیستم سالن زیبایی

## ۱. مقدمه

این دیاگرام ساختار کلاس‌های اصلی سیستم رزرو نوبت سالن زیبایی را نشان می‌دهد.

## ۲. کلاس‌ها

### ۲.۱ User (کاربر)
کلاس پایه برای تمام کاربران سیستم (شامل مشتری، متخصص و مدیر).

| ویژگی | نوع |
|--------|------|
| id | int |
| name | string |
| phone | string |
| password_hash | string |
| role | enum (Customer, Specialist, Admin) |

### ۲.۲ Customer (مشتری)
اطلاعات اختصاصی مشتریان.

| ویژگی | نوع |
|--------|------|
| id | int |
| user_id | int |
| address | string |

### ۲.۳ Specialist (متخصص)
اطلاعات اختصاصی متخصصین سالن.

| ویژگی | نوع |
|--------|------|
| id | int |
| user_id | int |
| specialty | string |
| working_hours_start | time |
| working_hours_end | time |

### ۲.۴ Service (خدمات)
خدماتی که در سالن ارائه می‌شود.

| ویژگی | نوع |
|--------|------|
| id | int |
| title | string |
| description | string |
| price | decimal |
| duration_minutes | int |

### ۲.۵ Appointment (نوبت)
نوبت‌های رزرو شده در سیستم.

| ویژگی | نوع |
|--------|------|
| id | int |
| customer_id | int |
| specialist_id | int |
| service_id | int |
| appointment_date | datetime |
| status | enum (Pending, Confirmed, Cancelled, Completed) |

### ۲.۶ Review (نظرات)
نظرات و امتیازاتی که مشتریان ثبت می‌کنند.

| ویژگی | نوع |
|--------|------|
| id | int |
| customer_id | int |
| specialist_id | int |
| rating | int (1 to 5) |
| comment | string |
| created_at | datetime |

## ۳. روابط

- User 1:1 Customer
- User 1:1 Specialist
- Customer 1:N Appointment
- Specialist 1:N Appointment
- Service 1:N Appointment
- Customer 1:N Review
- Specialist 1:N Review
