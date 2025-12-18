
// new code start
// --------------------
import { Schema, model, models, Document, Types } from "mongoose";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to verify referenced event exists
BookingSchema.pre("save", async function () {
  if (!this.isNew && !this.isModified("eventId")) return;

  const Event = models.Event || (await import("./event.model")).default;

  const eventExists = await Event.findById(this.eventId);

  if (!eventExists) {
    throw new Error("Referenced event does not exist");
  }
});

// Index for faster queries
BookingSchema.index({ eventId: 1 });

// Prevent model overwrite in dev
const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;


// old code 
// import { Schema, model, models, Document, Types } from 'mongoose';

// // TypeScript interface for Booking document
// export interface IBooking extends Document {
//   eventId: Types.ObjectId;
//   email: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const BookingSchema = new Schema<IBooking>(
//   {
//     eventId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Event',
//       required: [true, 'Event ID is required'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       trim: true,
//       lowercase: true,
//       validate: {
//         validator: function (v: string) {
//           // RFC 5322 compliant email validation regex
//           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
//         },
//         message: 'Please provide a valid email address',
//       },
//     },
//   },
//   {
//     timestamps: true, // Automatically manage createdAt and updatedAt
//   }
// );

// // Pre-save hook to verify that the referenced event exists
// BookingSchema.pre('save', async function (next) {
//   // Only validate eventId if it's modified or document is new
//   if (this.isModified('eventId')) {
//     try {
//       // Dynamically import Event model to avoid circular dependency
//       const Event = models.Event || (await import('./event.model')).default;
      
//       const eventExists = await Event.findById(this.eventId);
      
//       if (!eventExists) {
//         return next(new Error('Referenced event does not exist'));
//       }
//     } catch (error) {
//       return next(new Error('Failed to validate event reference'));
//     }
//   }

//   next();
// });

// // Create index on eventId for faster queries
// BookingSchema.index({ eventId: 1 });

// // Use existing model if available (prevents recompilation in development)
// const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

// export default Booking;