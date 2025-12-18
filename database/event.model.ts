// new code 
import { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  { timestamps: true }
);

// ✅ Modern async middleware (no next)
EventSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (this.isModified("date")) {
    const dateObj = new Date(this.date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Date must be a valid date string");
    }
    this.date = dateObj.toISOString().split("T")[0];
  }

  if (this.isModified("time")) {
    const time24h = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const time12h = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/;

    const value = this.time.trim();

    if (time24h.test(value)) {
      this.time = value;
    } else if (time12h.test(value)) {
      const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
      if (!match) throw new Error("Invalid time format");

      let hours = parseInt(match[1]);
      const minutes = match[2];
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      this.time = `${hours.toString().padStart(2, "0")}:${minutes}`;
    } else {
      throw new Error("Time must be in HH:MM or HH:MM AM/PM format");
    }
  }
});

EventSchema.index({ slug: 1 });

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;



// old code 
// import { Schema, model, models, Document } from 'mongoose';

// // TypeScript interface for Event document
// export interface IEvent extends Document {
//   title: string;
//   slug: string;
//   description: string;
//   overview: string;
//   image: string;
//   venue: string;
//   location: string;
//   date: string;
//   time: string;
//   mode: string;
//   audience: string;
//   agenda: string[];
//   organizer: string;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// const EventSchema = new Schema<IEvent>(
//   {
//     title: {
//       type: String,
//       required: [true, 'Title is required'],
//       trim: true,
//     },
//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, 'Description is required'],
//       trim: true,
//     },
//     overview: {
//       type: String,
//       required: [true, 'Overview is required'],
//       trim: true,
//     },
//     image: {
//       type: String,
//       required: [true, 'Image is required'],
//       trim: true,
//     },
//     venue: {
//       type: String,
//       required: [true, 'Venue is required'],
//       trim: true,
//     },
//     location: {
//       type: String,
//       required: [true, 'Location is required'],
//       trim: true,
//     },
//     date: {
//       type: String,
//       required: [true, 'Date is required'],
//       trim: true,
//     },
//     time: {
//       type: String,
//       required: [true, 'Time is required'],
//       trim: true,
//     },
//     mode: {
//       type: String,
//       required: [true, 'Mode is required'],
//       trim: true,
//     },
//     audience: {
//       type: String,
//       required: [true, 'Audience is required'],
//       trim: true,
//     },
//     agenda: {
//       type: [String],
//       required: [true, 'Agenda is required'],
//       validate: {
//         validator: (v: string[]) => Array.isArray(v) && v.length > 0,
//         message: 'Agenda must contain at least one item',
//       },
//     },
//     organizer: {
//       type: String,
//       required: [true, 'Organizer is required'],
//       trim: true,
//     },
//     tags: {
//       type: [String],
//       required: [true, 'Tags are required'],
//       validate: {
//         validator: (v: string[]) => Array.isArray(v) && v.length > 0,
//         message: 'Tags must contain at least one item',
//       },
//     },
//   },
//   {
//     timestamps: true, // Automatically manage createdAt and updatedAt
//   }
// );

// // Pre-save hook for slug generation, date normalization, and validation
// EventSchema.pre('save', function (next) {
//   // Generate slug from title only if title is modified or document is new
//   if (this.isModified('title')) {
//     this.slug = this.title
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, '') // Remove special characters
//       .replace(/\s+/g, '-') // Replace spaces with hyphens
//       .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
//       .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
//   }

//   // Normalize date to ISO format (YYYY-MM-DD)
//   if (this.isModified('date')) {
//     try {
//       const dateObj = new Date(this.date);
//       if (isNaN(dateObj.getTime())) {
//         throw new Error('Invalid date format');
//       }
//       this.date = dateObj.toISOString().split('T')[0];
//     } catch (error) {
//       return next(new Error('Date must be a valid date string'));
//     }
//   }

//   // Normalize time to HH:MM format (24-hour)
//   if (this.isModified('time')) {
//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     const time12hRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/;

//     if (timeRegex.test(this.time.trim())) {
//       // Already in 24-hour format
//       this.time = this.time.trim();
//     } else if (time12hRegex.test(this.time.trim())) {
//       // Convert 12-hour to 24-hour format
//       const match = this.time.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM|am|pm)$/);
//       if (match) {
//         let hours = parseInt(match[1]);
//         const minutes = match[2];
//         const period = match[3].toUpperCase();

//         if (period === 'PM' && hours !== 12) hours += 12;
//         if (period === 'AM' && hours === 12) hours = 0;

//         this.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
//       }
//     } else {
//       return next(new Error('Time must be in HH:MM or HH:MM AM/PM format'));
//     }
//   }

//   next();
// });

// // Create index on slug for faster queries
// EventSchema.index({ slug: 1 });

// // Use existing model if available (prevents recompilation in development)
// const Event = models.Event || model<IEvent>('Event', EventSchema);

// export default Event;
