# Class Specification — سیستم سالن زیبایی

## User (کاربر)
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت اطلاعات پایه تمام کاربران سیستم (مشتری، متخصص، ادمین) |
| ویژگی‌ها | id, name, phone, password_hash, role |
| متدها | login(), logout(), changePassword() |
| روابط | User 1:1 Customer, User 1:1 Specialist |

## Customer (مشتری)
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت اطلاعات اختصاصی مشتریان |
| ویژگی‌ها | id, user_id, address |
| متدها | bookAppointment(), cancelAppointment(), viewAppointments() |
| روابط | Customer 1:N Appointment, Customer 1:N Review |

## Specialist (متخصص)
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت اطلاعات و برنامه کاری متخصصین |
| ویژگی‌ها | id, user_id, specialty, working_hours_start, working_hours_end |
| متدها | viewSchedule(), updateAvailability() |
| روابط | Specialist 1:N Appointment, Specialist 1:N Review |

## Service (خدمات)
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت خدمات ارائه شده در سالن |
| ویژگی‌ها | id, title, description, price, duration_minutes |
| متدها | getDetails(), updatePrice() |
| روابط | Service 1:N Appointment |

## Appointment (نوبت)
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت فرآیند رزرو، لغو و وضعیت نوبت‌ها |
| ویژگی‌ها | id, customer_id, specialist_id, service_id, appointment_date, status |
| متدها | confirm(), cancel(), complete(), reschedule() |
| روابط | Customer 1:N Appointment, Specialist 1:N Appointment, Service 1:N Appointment |

## Review (نظرات)
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت نظرات و امتیازات ثبت شده توسط مشتریان |
| ویژگی‌ها | id, customer_id, specialist_id, rating, comment, created_at |
| متدها | submitReview(), calculateAverageRating() |
| روابط | Customer 1:N Review, Specialist 1:N Review |
