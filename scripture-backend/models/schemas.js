import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    firstName: { type: String, default: '', trim: true },
    lastName: { type: String, default: '', trim: true },
    pushToken: { type: String, default: '' },
  },
  { timestamps: true },
);

userSchema.virtual('name').get(function () {
  return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    book: { type: String, default: '' },
    bookName: { type: String, default: '' },
    chapter: { type: Number, default: null },
    verse: { type: Number, default: null },
    quote: { type: String, default: '' },
    body: { type: String, default: '' },
  },
  { timestamps: true },
);

const savedVerseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    book: { type: String, required: true },
    bookName: { type: String, required: true },
    chapter: { type: Number, required: true },
    verse: { type: Number, required: true },
    text: { type: String, required: true },
    translation: { type: String, required: true },
  },
  { timestamps: true },
);

savedVerseSchema.index(
  { userId: 1, book: 1, chapter: 1, verse: 1, translation: 1 },
  { unique: true },
);

export const User = mongoose.model('User', userSchema);
export const Note = mongoose.model('Note', noteSchema);
export const SavedVerse = mongoose.model('SavedVerse', savedVerseSchema);