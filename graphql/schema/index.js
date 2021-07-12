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
const { feedbackType } = require("./feedbackSchema");
const { helpType } = require("./helpSchema");


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
  ${feedbackType}
  ${helpType}

  type RootQuery {
    adminProfile : Admin!
    viewFeedback : [Feedback!]!
    
    categorys: [Category!]!
    doctor: Doctor!
    doctorProfile : Doctor!
    
    doctorAppoinment:Appoinment!
    appoinmentHistory :Appoinment!

    doctorCovidAppoinment:CovidAppoinment!
    covidAppoinmentHistory :CovidAppoinment!

    review: [Review!]!
    helpAndSupport: [HelpSupport!]!

    
    hospitalDetail: Hospital!
    
    staffProfile(staffId:String) : Staff!
    staffs : [Staff!]
    
    userProfile : User!
    myAppoinment :Appoinment!
    myCovidAppoinment :CovidAppoinment!
    
    adminlogin(username: String! , password: String! ): AdminAuthData!
    doctorlogin(username: String! , password: String! ): DoctorAuthData!
    userlogin(username: String! , password: String! ): UserAuthData!

  }
    
  type RootMutation {
    
    uploadImage(file: Upload!): File!

    updateAdmin(name: String , password: String): Admin!
    createHelp(user:String! , question:String! , answer:String!): HelpSupport!
    updateHelp(user:String! , question:String! , answer:String!): HelpSupport!
    deleteHelp(user:String! , question:String! , answer:String!): Boolean!
    createCategory(name: String!): Category!

    createAdvertisment(advertismentInput: AdvertismentInput): Advertisment!
    createAdvertismentPhoto(advertismentPhotoInput: AdvertismentPhotoInput): AdvertismentPhoto!
    
    changePassword(oldpassword: String! , newpassword: String!):Boolean!
    
    createDoctor(doctorInput: DoctorInput): Doctor!
    createStaff(staffInput: StaffInput): Staff!
    updateDoctor(updateDoctorInput: UpdateDoctor):Doctor!
    updateDoctorStaff(updateStaff: UpdateStaff , staffId:String):Staff!
    updateSlot(slot:[String]! , day: String!):Slot!
    deleteStaff(staffId: String):Boolean!

    updateHospital(updateHospital: HospitalInput):Hospital!
    updateCovidCenter(updateCovidCenter: CovidCenterInput):CovidCenter!
    updateCovidStatus(status: String!):Boolean!

    attendence(status:String!): Attendence!
    
    createCovidAppoinment(appoinmentInput: AppoinmentInput): Boolean!
    cancleCovidAppoinment(appoinmentId:String!,status:String!):Boolean!
    covidAppoinmentAccept(appoinmentId:String!,status:String!):Boolean!
    covidAppoinmentVisit(appoinmentId:String!,status:String!):Boolean!

    createAppoinment(appoinmentInput: AppoinmentInput): Boolean!
    cancleAppoinment(appoinmentId:String!,status:String!):Boolean!
    appoinmentAccept(appoinmentId:String!,status:String!):Boolean!
    appoinmentVisit(appoinmentId:String!,status:String!):Boolean!

    createReview(reviewInput: ReviewInput): Review!
    createUser(userInput: UserInput): User!

    feedback(feedback:String! , rating:Float!):Feedback!
    
    
  }
    
  schema {
      query: RootQuery
      mutation: RootMutation
  }
`;

module.exports = buildSchema(schema);
