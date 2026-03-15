import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js"

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Sign a proper object payload — decoded.email can be verified in middleware
      const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })
      res.json({ success: true, token })
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('Admin login error:', error.message)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
}

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(200).json({ success: true, message: "Doctor Added" });

  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

const appointmentCancel = async (req, res) => {
  try {

    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)


    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Appointment Cancelled' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password').lean()
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).lean()
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {

    const doctorsCount = await doctorModel.countDocuments()
    const usersCount = await userModel.countDocuments()
    const appointmentsCount = await appointmentModel.countDocuments()
    const latestAppointments = await appointmentModel.find({}).sort({ date: -1 }).limit(5).lean()

    const dashData = {
      doctors: doctorsCount,
      appointments: appointmentsCount,
      patients: usersCount,
      latestAppointments
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
const updateDoctorProfile = async (req, res) => {
  try {
    const { doctorId, about, fees, address, available } = req.body

    if (!doctorId) {
      return res.json({
        success: false,
        message: "Doctor ID is required",
      })
    }

    const doctor = await doctorModel.findById(doctorId)

    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      })
    }

    // Update only allowed fields
    if (about !== undefined) doctor.about = about
    if (fees !== undefined) doctor.fees = fees
    if (address !== undefined) doctor.address = address
    if (available !== undefined) doctor.available = available

    await doctor.save()

    res.json({
      success: true,
      message: "Doctor profile updated successfully",
    })

  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message,
    })
  }
}



export { loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard, updateDoctorProfile }
