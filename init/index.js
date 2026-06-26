const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../models/listing.js");

main()
.then((res)=>{
    console.log("connection secussfull")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"6a3c366b061174029c96dadc"}))
     await Listing.insertMany(initData.data);
    console.log("data was inslize");
};

initDB();