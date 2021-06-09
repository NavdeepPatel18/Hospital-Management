const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    
    type Admin{
        _id:ID!
        name: String!
        password: String
    }

    type Category{
        _id: ID!
        name: String!
    }

    type Doctor{
        _id: ID!
        name: String!
        education: String!
        experience: Int!
        city: String!
        email: String!
        password: String
        category: Category!
        phone: Int!
        createdAt: String!
        updatedAt: String!
    }

    type Hospital{
        _id: ID!
        doctor: Doctor!
        name: String!
        city: String!
        email: String!
        number1: Int!
        number2: Int!
        location: String
        address: String!
    }

    type HospitalPhoto{
        _id: ID!
        name: String!
        photo: String!
        hospital: Hospital!
    }

    type Facilities{
        _id: ID!
        name: String!
        hospital: Hospital!
    }

    type Staff{
        _id: ID!
        name: String!
        password: String
        doctor: Doctor!
        designation: String!
        createdAt: String!
        updatedAt: String!
    }

    type Attendence{
        _id: ID!
        doctor: Doctor!
        staff: Staff!
        timeIn: String
        timeOut: String
    }

    type Day{
        _id: ID!
        name: String!
        avability: [Avability!]!
    }

    type Avability{
        _id: ID!
        doctor: Doctor!
        slot: String!
        day: Day!
    }

    type User{
        _id: ID!
        name: String!
        city: String!
        address: String!
        email: String!
        password: String
        age: Int!
        gender: String!
        phone: Float!
        createdAt: String!
        updatedAt: String!
    }

    type Appoinment{
        _id: ID!
        doctor: Doctor!
        user: User!
        covidBooking: CovidBooking
        problem: String
        bp: Float
        caseType: String!
        suger: Float
        allergy: String
        history: String
        date: String!
        time: String!
        tocken: Int!
        conformby: String!
        status: String!
        statusDate: String!
    }

    type Review{
        _id: ID!
        doctor: Doctor!
        user: User!
        text: String!
        rating: Int!
        createdAt: String!
        updatedAt: String!
    } 

    type CovidCenter{
        _id: ID!
        hospital: Hospital!
        totalbed: Int!
        oxygen: Boolean!
        ventilator: Boolean! 
    }

    type CovidBooking{
        _id: ID!
        user: User!
        center: CovidCenter!
        bedno: Int!
        oxygen: Boolean!
        ventilator: Boolean!
        dateIn: String!
        dateOut: String!
    }

    type Advertisment{
        _id: ID!
        doctor: Doctor
        startDate: String!
        endDate: String!
        title: String!
        detail: String!
        status: String!
    }

    type AdvertismentPhoto{
        _id: ID!
        advertisment: Advertisment!
        photo: String!
    }

    type Payment{
        _id: ID!
        advertisment: Advertisment!
        status: String!
        token: String!
        date: String!
    }

    type DoctorAuthData{
        userId: ID!
        token: String!
        tokenExpiraction: Int!
    }

    type UserAuthData{
        userId: ID!
        token: String!
        tokenExpiraction: Int!
    }

    type AdminAuthData{
        userId: ID!
        token: String!
        tokenExpiraction: Int!
    }

    type StaffAuthData{
        userId: ID!
        token: String!
        tokenExpiraction: Int!
    }

    input DoctorInput {
        name: String!
        education: String!
        experience: Int!
        city: String!
        email: String!
        password: String
        phone: Float!
    }

    input HospitalInput {
        name: String!
        city: String!
        email: String!
        number1: Int!
        number2: Int!
        location: String
        address: String!
        doctor: String!
    }

    input HospitalPhotoInput {
        name: String!
        photo: String!
        hospital: String!
    }

    input FacilitiesInput {
        name: String!
        hospital: String!
    }

    input StaffInput{
        name: String!
        password: String
        designation: String!
    }

    input AttendenceInput{
        staff: String!
        timeIn: String
        timeOut: String
    }

    input UserInput{
        name: String!
        city: String!
        address: String!
        email: String!
        password: String
        age: Int!
        gender: String!
        phone: Float!
    }

    input AppoinmentInput{
        doctor: String!
        covidBooking: String
        problem: String
        bp: Float
        caseType: String!
        suger: Float
        allergy: String
        history: String
        date: String!
        time: String!
        tocken: Int!
    }

    input ReviewInput{
        doctor: String!
        text: String!
        rating: Int!
    } 

    input CovidCenterInput{
        hospital: String!
        totalbed: Int!
        oxygen: Boolean!
        ventilator: Boolean! 
    }

    input CovidBookingInput{
        center: String!
        bedno: Int!
        oxygen: Boolean!
        ventilator: Boolean!
        dateIn: String!
        dateOut: String
    }

    input AdvertismentInput{
        doctor: String
        startDate: String!
        endDate: String!
        title: String!
        detail: String!
    }

    input AdvertismentPhotoInput{
        advertisment: String!
        photo: String!
    }

    input PaymentInput{
        advertisment: String!
        token: String!
        date: String!
    }

    type RootQuery {
        doctor: Doctor!
        doctorlogin(username: String! , password: String! ): DoctorAuthData!
        adminlogin(username: String! , password: String! ): AdminAuthData!
        stafflogin(username: String! , password: String! ): StaffAuthData!
        userlogin(username: String! , password: String! ): UserAuthData!
    }
      
    type RootMutation {
        createCategory(name: String!): Category!
        createDoctor(doctorInput: DoctorInput): Doctor!
        createHospital(hospitalInput: HospitalInput): Hospital!
        createHospitalPhoto(hospitalPhotoInput: HospitalPhotoInput): HospitalPhoto!
        createFacilities(facilitiesInput: FacilitiesInput): Facilities!
        createStaff(staffInput: StaffInput): Staff!
        attendence(attendenceInput: AttendenceInput): Attendence!
        createUser(userInput: UserInput): User!

    }
      
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
