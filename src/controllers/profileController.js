const mongoose = require('mongoose');
const Profile = require('../models/profile'); 
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/APIFeatures');

// Create a new profile
exports.createProfile = catchAsync(async (req, res) => {
  const profile = new Profile(req.body);
  await profile.save();
  res.status(201).json({
    status: 'success',
    data: {
      profile
    }
  });
});

// Get all profiles with API features
exports.getAllProfiles = catchAsync(async (req, res) => {
  // Initialize APIFeatures with Profile.find() and query parameters
  const features = new APIFeatures(Profile.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute the query
  const profiles = await features.query;

  res.status(200).json({
    status: 'success',
    results: profiles.length,
    data: {
      profiles
    }
  });
});

// Get profile by ID
exports.getProfileById = catchAsync(async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return res.status(404).json({ 
      status: 'fail',
      message: 'Profile not found' 
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

// Update a profile
exports.updateProfile = catchAsync(async (req, res) => {
  const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!profile) {
    return res.status(404).json({ 
      status: 'fail',
      message: 'Profile not found' 
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

// Patch a profile
exports.patchProfile = catchAsync(async (req, res) => {
  const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!profile) {
    return res.status(404).json({ 
      status: 'fail',
      message: 'Profile not found' 
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

// Delete a profile
exports.deleteProfile = catchAsync(async (req, res) => {
  const profile = await Profile.findByIdAndDelete(req.params.id);
  if (!profile) {
    return res.status(404).json({ 
      status: 'fail',
      message: 'Profile not found' 
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'Profile deleted successfully'
  });
});
