const advertismentType = `
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
input AdvertismentInput{
  doctor: String!
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
`;

exports.advertismentType = advertismentType;
