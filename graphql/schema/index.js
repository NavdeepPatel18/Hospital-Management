const { buildSchema } = require("graphql");
const { Upload } = require("graphql-upload");
const { adminType } = require("./adminSchema");
const { advertismentType } = require("./advertismentSchema");
const { appoinmentType } = require("./appoinmentSchema");
const { attendenceType } = require("./attendenceSchema");
const { covidType } = require("./covidSchema");
const { doctorType } = require("./doctorSchema");
const { hospitalType } = require("./hospitalSchema");
const { reviewType } = require("./reviewSchema");
const { staffType } = require("./staffSchema");
const { userType } = require("./userSchema");

const schema = `

  ${adminType}
  ${doctorType}
  ${staffType}
  ${hospitalType}
  ${covidType}
  ${attendenceType}
  ${advertismentType}
  ${userType}
  ${appoinmentType}
  ${reviewType}

  type RootQuery {
    adminlogin(username: String! , password: String! ): AdminAuthData!
    categorys: [Category!]!
    doctor: Doctor!
    doctorProfile : Doctor!
    staffProfile(staffId:String) : Staff
    staffs : [Staff!]
    adminProfile : Admin!
    userProfile : User!
    hospitalDetail(userId: String!) : Hospital!
    doctorlogin(username: String! , password: String! ): DoctorAuthData!
    stafflogin(username: String! , password: String! ): StaffAuthData!
    userlogin(username: String! , password: String! ): UserAuthData!

  }
    
  type RootMutation {
    uploadImage(file: Upload!): File!
    createCategory(name: String!): Category!
    createAdvertisment(advertismentInput: AdvertismentInput): Advertisment!
    createAdvertismentPhoto(advertismentPhotoInput: AdvertismentPhotoInput): AdvertismentPhoto!
    createAppoinment(appoinmentInput: AppoinmentInput): Appoinment!
    attendence(attendenceInput: AttendenceInput): Attendence!
    createCovidCenter(covidCenterInput: CovidCenterInput): CovidCenter!
    createCovidBooking(covidBookingInput: CovidBookingInput): CovidBooking!
    createDoctor(doctorInput: DoctorInput): Doctor!
    createStaff(staffInput: StaffInput): Staff!
    createHospital(hospitalInput: HospitalInput): Hospital!
    createHospitalPhoto(hospitalPhotoInput: HospitalPhotoInput): HospitalPhoto!
    createFacilities(facilitiesInput: FacilitiesInput): Facilities!
    createReview(reviewInput: ReviewInput): Review!
    createUser(userInput: UserInput): User!
    
    changePassword(oldpassword: String! , newpassword: String!):Boolean!
    updateAdmin(name: String , password: String): Admin!
    updateDoctorStaff(updateStaff: UpdateStaff , staffId:String):Staff!
    deleteStaff(staffId: String):Boolean!
  }
    
  schema {
      query: RootQuery
      mutation: RootMutation
  }
`;

module.exports = buildSchema(schema);
