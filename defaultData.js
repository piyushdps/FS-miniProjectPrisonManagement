
const DefaultPrisonsList = [
    { name: "Tihar", id: 1, occupancy: 200 },
    { name: "Hajipur", id: 2, occupancy: 100 },
  ];
  const DefaultPrisonersList = [
    { name: "Saurya", id: 1,crime:'Murder of gyaan' , prisonName:"Hajipur" ,  prisonId: 2},
    { name: "Siddhant", id: 2, crime: ' Smoking inside acharya campus' , prisonId:1 , prisonName:"Tihar"},
  ];




  module.exports = {
      DefaultPrisonsList,
      DefaultPrisonersList
  }