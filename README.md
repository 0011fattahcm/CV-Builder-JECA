# CV Builder JECA

**CV Builder JECA** is a web-based application built using the MERN Stack that allows users to create, manage, and export professional Japanese-style CVs. The app also includes a QRIS payment system, export quota management, and additional tools such as PDF merging and image-to-PDF conversion.

---

## 🧱 Technologies Used

- **Frontend**: React.js + Vite + Tailwind CSS  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT (JSON Web Token)  
- **Payment**: Xendit QRIS  
- **File Export**: ExcelJS, LibreOffice (convert Excel to PDF)  
- **Realtime**: Socket.io  
- **Email Service**: Nodemailer  

---

## 📦 Libraries Used

### Frontend:
- `axios`, `react-router-dom`, `react-toastify`, `socket.io-client`
- `react-modal`, `date-fns`, `clsx`, `tailwindcss`

### Backend:
- `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`
- `nodemailer`, `exceljs`, `child_process`, `cors`, `uuid`
- `xendit-node`, `socket.io`, `mime-types`, `multer`
- `LibreOffice` CLI for Excel-to-PDF conversion

---

## 🌐 Deployment

**Frontend**: Niagahoster / Hostinger  
**Backend**: Amazon Web Services (EC2)  
**Database**: MongoDB Atlas  

---

## 🚀 Main Features

### 👤 For Users
- Register, verify email, login  
- Forgot & reset password  
- Edit CV (step-by-step):
  - Personal Information (formatted in Japanese style)
  - Education, Work Experience, Family, Japan Visit History  
- Upload profile photo  
- Preview CV before export  
- Export CV:
  - Excel format (with customized styling)
  - PDF format (converted via LibreOffice)
- Export quota system:
  - +2 quota after successful QRIS payment  
  - -1 quota per export  
- Usage history:
  - View total exports, remaining quota, payment history,  
    login/register logs, PDF merge, image-to-PDF conversions  

### 📄 Additional Document Tools
- **PDF Merger**
  - Upload up to 10 PDF files  
  - Reorder before merging  
  - Automatically named output: `Merger_username.pdf`
- **JPG to PDF Converter**
  - Upload up to 10 JPG files  
  - Options: A4 or original size  
  - Option to merge all images into one PDF or keep as separate files  

---

### 👑 For Admins
- Secure login via route `/rx78gpo1p6`
- Admin Dashboard:
  - Statistics: total users, exports, payments, etc.  
- User management (CRUD)
- CV list per user with direct export feature
- Payment history table (50 records per page)
- User activity log table
- Send announcements to users  

---

## 💰 Payment System
- QRIS via Xendit API integration  
- QR popup appears automatically when export quota is 0  
- Auto polling every 5 seconds until payment status is `PAID`  
- +2 export quota added automatically after successful payment  
- Protection: export blocked if the user closes the payment modal before completing payment  

---

## 📌 Planned Features
The following features are **planned for future updates**:
- Additional CV templates (minimalist, modern, etc.)  
- Multi-language support (Indonesian, Japanese, English)  
- Premium package system & email notifications  

---
