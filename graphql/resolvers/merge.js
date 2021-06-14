const admin = async (staffId) => {
  try {
    const admin = await Admin.findById(staffId);
    if (!admin) {
      throw new Error("User not exist!");
    }
    return { ...admin._doc, _id: admin.id, password: null };
  } catch (err) {
    throw err;
  }
};

const hospitalPhoto = async (hospitalPhotoId) => {
  try {
    const hospitalPhoto = await Category.findById(hospitalPhotoId);
    return { ...hospitalPhoto._doc, _id: hospitalPhoto.id };
  } catch (err) {
    throw err;
  }
};

const doctor = async (staffId) => {
  try {
    const doctor = await Doctor.findById(staffId);
    return { ...doctor._doc, _id: doctor.id, password: null };
  } catch (err) {
    throw err;
  }
};

const hospital = async (hospitalId) => {
  try {
    const hospital = await Hospital.findById(hospitalId);
    return { ...hospital._doc, _id: hospital.id };
  } catch (err) {
    throw err;
  }
};

const HospitalPhoto = async (hospitalId) => {
  try {
    const hospitalPhotos = await HospitalPhoto.findById(hospitalId);
    return hospitalPhotos.map((hospitalPhoto) => {
      return { ...hospitalPhoto._doc, _id: hospitalPhoto.id };
    });
  } catch (err) {
    throw err;
  }
};

const Faclities = async (hospitalId) => {
  try {
    const facilities = await Faclities.findById(hospitalId);
    return { ...facilities._doc, _id: facilities.id };
  } catch (err) {
    throw err;
  }
};

const Staff = async (doctorId) => {
  try {
    const staffs = await Staff.findById(doctorId);
    return staffs.map((staff) => {
      return { ...staff._doc, _id: staff.id, password: null };
    });
  } catch (err) {
    throw err;
  }
};
