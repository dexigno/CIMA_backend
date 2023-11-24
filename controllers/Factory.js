const APIFeatures = require('../utils/APIFeatures');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsync = require('../utils/catchAsync');

exports.softDelete = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!doc) {
      return next(new ErrorHandler('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ErrorHandler('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new ErrorHandler('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model, ...populations) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    populations.forEach((populate, index) => {
      if (index % 2 === 0) {
        const populateRef = populate;
        const poplateFields = populations[index + 1];
        query = query.populate(populateRef, poplateFields);
      }
    });
    const doc = await query;

    if (!doc) {
      return next(new ErrorHandler('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model, filter = {}, ...populations) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find(filter);

    populations.forEach((populate, index) => {
      if (index % 2 === 0) {
        const populateRef = populate;
        const poplateFields = populations[index + 1];
        query = query.populate(populateRef, poplateFields);
      }
    });

    const features = new APIFeatures(query, req.query).filter().sort().limitFields().paginate();

    const doc = await features.query;

    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

exports.getAllByDoctor = (Model, filter = {}, ...populations) =>
  catchAsync(async (req, res, next) => {
    filter.doctor = req.user._id;

    let query = Model.find(filter);

    populations.forEach((populate, index) => {
      if (index % 2 === 0) {
        const populateRef = populate;
        const poplateFields = populations[index + 1];
        query = query.populate(populateRef, poplateFields);
      }
    });

    const features = new APIFeatures(query, req.query).filter().sort().limitFields().paginate();

    const doc = await features.query;

    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });
