const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./reviews.js");
const listingSchema = new Schema({
  title:{
    type:String,
    required :true,
   },
   description:String,
   image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://img.magnific.com/free-photo/wet-vietnam-mountain-flow-stream-rural_1417-1357.jpg?semt=ais_hybrid&w=740&q=80",
    },
  },
  price:Number,
  location:String,
  country:String,
  reviews:[
    {
    type:Schema.Types.ObjectId,
    ref:"Review",
  },
   ],
   owner:{
    type:Schema.Types.ObjectId,
    ref: "User",
   }
}) ;
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}})
  }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;