import express from 'express';
import { getAppointmentsToday,addHoliday,getHolidays,deleteHoliday,loginAdmin,allDepartmentsDoctor, updateDoctorDepartment,appointmentsAdmin,deleteDoctor, getAllPatients,appointmentCancel,updateDepartment, deleteDepartment,addDoctor, allDoctors,allDepartments,addDepartment, adminDashboard ,deletePatient} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
// adminRouter.get("/update-department", upload.single('image'), authAdmin, updateDepartment)
adminRouter.post("/add-holiday", authAdmin, addHoliday);
adminRouter.get("/holidays", authAdmin, getHolidays);
adminRouter.delete("/holiday/:id", authAdmin, deleteHoliday);
adminRouter.post("/update-department/:id", upload.single('image'), authAdmin, updateDepartment)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.put('/doctors/:id/department', authAdmin, updateDoctorDepartment);
adminRouter.get("/all-doctors-departments", authAdmin, allDepartmentsDoctor);
adminRouter.get("/all-departments", authAdmin, allDepartments);
adminRouter.get("/appointments-today", authAdmin, getAppointmentsToday)
adminRouter.get('/get-all-patients', authAdmin, getAllPatients);
adminRouter.delete('/delete-patient/:id', authAdmin, deletePatient);
adminRouter.delete("/delete-doctor/:id", authAdmin, deleteDoctor);
adminRouter.post('/add-department', authAdmin, upload.single('image'), addDepartment)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.delete("/delete-department/:id", authAdmin, deleteDepartment);
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;