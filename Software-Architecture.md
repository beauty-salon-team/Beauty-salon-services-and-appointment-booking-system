Software Architecture – Beauty Salon Services and Appointment Booking System

1. Introduction

The system helps customers explore beauty salon services, view prices, and book appointments online.

2. User Types

* Customer: Registers, logs in, views services, and books or cancels appointments.
* Beauty Specialist: Views their schedule and appointment information.
* Salon Manager: Manages services, prices, specialists, and schedules.

3. Main Components

* User Interface: Allows users to interact with the system.
* User Management: Handles registration and login.
* Service Management: Stores and displays salon services and prices.
* Appointment Management: Handles appointment booking, viewing, and cancellation.
* Schedule Management: Manages specialists’ available times.
* Database: Stores users, services, specialists, schedules, and appointments.

4. System Architecture

The system uses a layered architecture:

1. Presentation Layer: The user interface.
2. Application Layer: Business rules and appointment processing.
3. Data Layer: Database storage and retrieval.

5. Main Database Entities

* User
* Customer
* Specialist
* Service
* Appointment
* Schedule

6. Conclusion

This architecture separates the user interface, business logic, and data storage to make the system easier to understand, maintain, and extend.
