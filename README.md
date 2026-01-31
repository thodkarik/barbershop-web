# BarberShop Frontend

Frontend εφαρμογή για σύστημα διαχείρισης barbershop με ραντεβού, ρόλους χρηστών και JWT authentication.

Η εφαρμογή αναπτύχθηκε στο πλαίσιο της τελικής εργασίας του Coding Factory (ΟΠΑ) και λειτουργεί σε συνδυασμό με το BarberShopAPI backend.

---

## Περιγραφή
Το frontend υποστηρίζει:
- Authentication με JWT (login / register)
- Role-based navigation και routing
- Διαχείριση ραντεβού ανά ρόλο χρήστη
- Integration με REST API (ASP.NET Core backend)
- Απλό και καθαρό UI (χωρίς πολύπλοκο calendar)

---

## Ρόλοι & Λειτουργικότητα UI

Η εφαρμογή προσαρμόζεται δυναμικά ανάλογα με τον ρόλο του χρήστη:

### Customer
- Προβολή διαθέσιμων services
- Κλείσιμο ραντεβού
- Προβολή προσωπικών ραντεβού

### Barber
- Προβολή προγράμματος (ραντεβού που του έχουν ανατεθεί – read-only)

### Receptionist
- Προβολή όλων των ραντεβού
- Αλλαγή κατάστασης ραντεβού (Completed / Canceled / NoShow)

### Admin
- Διαχείριση services (CRUD)
- Πρόσβαση στη λειτουργικότητα Receptionist (Manage Bookings)
- Προβολή Staff Directory (Barbers & Receptionists – read-only)

Η πλοήγηση και η πρόσβαση στα routes ελέγχονται μέσω role-based guards στο frontend και μέσω JWT authorization στο backend.

---

## Τεχνολογίες
- React
- Vite
- TypeScript
- Axios
- React Router
- TailwindCSS

---

## Αρχιτεκτονική Frontend
Η εφαρμογή ακολουθεί modular δομή:

- `features/` – feature-based modules (auth, appointments, admin κλπ)
- `shared/`
    - `api/` – axios instance & API calls
    - `components/` – reusable UI components
    - `types/` – shared TypeScript types
    - `utils/` – helpers (JWT, error handling)
- Context API για authentication state
- Axios interceptors για Authorization header

---

## Authentication & Authorization
- JWT token αποθηκεύεται στο `localStorage`
- Axios interceptor προσθέτει Authorization header
- Role-based routing με προστατευμένα routes
- Automatic logout πραγματοποιείται όταν λήξει το JWT token
- User-friendly error handling (χωρίς raw backend exceptions)

---

## Scope & Limitations

Η εφαρμογή υλοποιείται ως MVP (Minimum Viable Product):

- Οι λογαριασμοί προσωπικού (Admin / Receptionist / Barber) δημιουργούνται μέσω database seeding στο backend.
- Το frontend παρέχει **read-only Staff Directory** για Admin.
- Πλήρης διαχείριση χρηστών (create / edit / delete staff & roles) είναι εκτός scope για το παρόν MVP και πραγματοποιείται μέσω backend tooling / database administration.

Η επιλογή αυτή διατηρεί το frontend επικεντρωμένο στις βασικές επιχειρησιακές ροές (ραντεβού και services).

---

## Πώς γίνεται build & run (Frontend)

### Προαπαιτούμενα
- Node.js (v18+)
- npm ή yarn
- Running backend API (BarberShopAPI)

### 1) Clone του repository
git clone https://github.com/thodkarik/barbershop-web

### 2) Εγκατάσταση dependencies
npm install

### 3) Εκκίνηση εφαρμογής
npm run dev

Η εφαρμογή θα τρέξει στο:
http://localhost:5173

---

## Backend Integration
Το frontend αναμένει το backend API να τρέχει στο:
https://localhost:7236

Τα API endpoints καταναλώνονται μέσω Axios με κοινό base URL.

---

## Author
Θοδωρής Καρίκης

