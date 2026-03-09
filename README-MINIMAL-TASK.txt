Bajarilgan topshiriqlar:
1) category CRUD
2) mashinalar CRUD
3) categoryga tegishli mashinalar uchun alohida GET API: /api/categories/:id/cars
4) category va mashina qo'shish/o'chirish/o'zgartirish faqat admin
5) oddiy user faqat ko'ra oladi
6) Joi validation qo'shilgan

Asosiy endpointlar:
POST   /api/auth/register
POST   /api/auth/login

GET    /api/categories
GET    /api/categories/:id
GET    /api/categories/:id/cars
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/cars
GET    /api/cars/:id
POST   /api/cars
PUT    /api/cars/:id
DELETE /api/cars/:id
