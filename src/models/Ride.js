import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // creator
  source: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  seatsAvailable: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Ride || mongoose.model('Ride', RideSchema);
