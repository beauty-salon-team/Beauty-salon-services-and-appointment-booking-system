# Class Specification — هوم‌استور

## Product
| بخش | توضیح |
|------|-------|
| مسئولیت | نمایش و مدیریت محصولات |
| ویژگی‌ها | id, name, price, stock, brand |
| متدها | getDetails(), updateStock(), isAvailable() |
| روابط | Category 1:N Product |

## Category
| بخش | توضیح |
|------|-------|
| مسئولیت | گروه‌بندی محصولات |
| ویژگی‌ها | id, name, slug, parent_id |
| روابط | Category 1:N Product |

## Customer
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت اطلاعات مشتری |
| ویژگی‌ها | id, name, phone, address |
| متدها | placeOrder(), viewOrders() |
| روابط | Customer 1:N Order |

## Order
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت سفارش‌ها |
| ویژگی‌ها | id, total, status, created_at |
| متدها | calculateTotal(), updateStatus() |
| روابط | Customer 1:N Order, Order 1:N OrderItem |

## OrderItem
| بخش | توضیح |
|------|-------|
| مسئولیت | یک قلم در سفارش |
| ویژگی‌ها | id, quantity, unit_price |
| متدها | getSubtotal() |
| روابط | Order 1:N OrderItem |

## User (Admin)
| بخش | توضیح |
|------|-------|
| مسئولیت | مدیریت ادمین‌ها |
| ویژگی‌ها | id, email, password_hash, role |
| متدها | login(), logout() |