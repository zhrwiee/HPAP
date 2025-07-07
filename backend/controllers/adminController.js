import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import departmentModel from "../models/DepartmentModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const admin_URL = "https://hpap-backend.onrender.com/api/admin/login";
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
      .sort({ slotDate: -1, slotTime: -1 }) // Latest first
      .populate('userId'); // Optional: if you're not already getting user data here

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// POST /api/admin/update-department/:id
const updateDepartment = async (req, res) => {
  try {
    const { departmentname } = req.body;
    const { id } = req.params;
    const imageFile = req.file;

    if (!departmentname) {
      return res.json({ success: false, message: 'Department name is required' });
    }

    const updateData = { departmentname };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      updateData.image = imageUpload.secure_url;
    }

    await departmentModel.findByIdAndUpdate(id, updateData);

    res.json({ success: true, message: 'Department updated' });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// API to add  department 
const addDepartment = async (req, res) => {
  try {
    const { departmentname } = req.body;
    const imageFile = req.file;

    if (!departmentname) {
      return res.json({ success: false, message: 'Department name is required' });
    }

    if (!imageFile) {
      return res.json({ success: false, message: 'Image file is required' });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image"
    });

    const departmentData = {
      departmentname,
      image: imageUpload.secure_url,
      createdAt: Date.now() // Align with schema field
    };

    const newDepartment = new departmentModel(departmentData);
    await newDepartment.save();

    res.json({
      success: true,
      message: 'Department added successfully',
      department: newDepartment
    });

  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: 'Failed to add department'
    });
  }
};


// API for adding Doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, about, address, department } = req.body;
        const imageFile = req.file; // may be undefined if user doesn't upload

        if (!name || !email || !password || !address || !department) {
          return res.json({ success: false, message: "Missing required details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imageUrl = null;

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl, // may be null
            about,
            address: JSON.parse(address),
            departmentname: department,
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: 'Doctor Added' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

 const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await doctorModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Doctor deleted" });
  } catch (error) {
    console.error("Delete doctor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// api to get all department list for admin panel
const allDepartments = async (req, res) => {
  try {
    const departments = await departmentModel.find({});
    res.json({ success: true, departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    await departmentModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Department deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

 const deletePatient = async (req, res) => {
  try {
    const id = req.params.id;
    await userModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

 const getAllPatients = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAppointmentsToday = async (req, res) => {
  try {
    const today = new Date();
    const formatted = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

    const appointments = await appointmentModel
      .find({ slotDate: formatted })
      .sort({ slotTime: 1 })
      .populate('userId', 'name image'); // Optional if you use `userData`

    // In case userData is not set, fall back to userId
    const enrichedAppointments = appointments.map(a => ({
      ...a._doc,
      userData: a.userData || a.userId,
    }));

    res.json({ success: true, appointments: enrichedAppointments });
  } catch (error) {
    console.error('Error fetching today appointments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({}).sort({ date: -1 });

    // Fix missing date fields by parsing slotDate and slotTime
    appointments.forEach(app => {
      if (!app.date && app.slotDate && app.slotTime) {
        const [day, month, year] = app.slotDate.split('_').map(Number);
        const dateString = `${month}/${day}/${year} ${app.slotTime}`;
        app.date = new Date(dateString).getTime();
      }
    });

    // Date boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const past7Start = new Date(today);
    past7Start.setDate(today.getDate() - 6);
    past7Start.setHours(0, 0, 0, 0);
    const past7Timestamp = past7Start.getTime();

    // Latest appointment (not cancelled)
    const latest = appointments.find(app => !app.cancelled);

    let latestAppointment = null;
    if (latest && latest.userId) {
      const user = await userModel.findById(latest.userId).lean();
      latestAppointment = {
        ...latest._doc,
        userData: user
          ? {
              _id: user._id,
              name: user.name,
              image: user.image,
            }
          : {},
      };
    }

    // Upcoming appointments count
    const upcomingAppointments = appointments.filter(
      app => !app.cancelled && app.date >= todayTimestamp
    ).length;

    // Past 7 days appointments
    const past7Appointments = appointments.filter(
      app => app.date >= past7Timestamp && !app.cancelled
    );

    const avgPerDay = +(past7Appointments.length / 7).toFixed(1);

    const dashData = {
      appointments: appointments.length,
      patients: users.length,
      totalDoctors: doctors.length,
      availableDoctors: doctors.filter(d => d.isAvailable).length,
      latestAppointment,
      upcomingAppointments,
      avgPerDay,
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    updateDepartment,
    deleteDepartment,
    allDepartments,
    deletePatient,
    getAllPatients,
    addDepartment,
    allDoctors,
    deleteDoctor,
    getAppointmentsToday,
    adminDashboard
}