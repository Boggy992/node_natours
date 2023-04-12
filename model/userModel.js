const crypto = require('crypto');
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'User must have a name'],
    maxLength: [40, 'A user must have less or equal then 40 characters'],
    minLength: [2, 'A user must have more or equal then 2 characters'],
  },
  slug: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Email address is required'],
    validate: [validator.isEmail, 'Please fill a valid email address'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'User must have password'],
    minLength: 8,
    // select: false - sakriveno polje za usera
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      // validator vraca true ili false(ako vrati false onda ulazi u error)
      // This only works on SAVE!!! findByIdAndUpdate() nece raditi !!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  // otprilike ce biti 10 minuta da se resetuje password zatim se ponistava
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// ovakav vid fukncije ce se pokrenuti odmah pre nego sto se dokument sacuva(user);
userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// hash password value before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // clear passwordConfirm from input in database
  this.passwordConfirm = undefined;
  next();
});

// ovakav vid fukncije ce se pokrenuti odmah pre nego sto se dokument sacuva(user);
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

// Instance methods - metoda dostupna u celom dokumentu za odredjenu kolekciju
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // vraca true ili false, userPassword je hash-ovana vrednost
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  // passwordChangedAt je kreiran samo ako user promeni sifru
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }

  // false znaci da password nije promenjen
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // original reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrypted reset token saved in database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // ovde smo samo modifikovali zato moramo da pokrenemo user.save() u forgotPassword
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
