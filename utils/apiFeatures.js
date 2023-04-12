const { EXCLUDED_FIELDS } = require('./constants');

class ApiFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
  }

  filter() {
    let { model, queryString } = this;
    let newQueryString = { ...queryString };

    EXCLUDED_FIELDS.forEach((el) => delete newQueryString[el]);

    let queryStringify = JSON.stringify(newQueryString);
    let replaceQueryString = queryStringify.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    model = model.find(JSON.parse(replaceQueryString));

    return this;
  }

  sort() {
    let {
      model,
      queryString: { sort },
    } = this;

    // default
    if (!sort) {
      model = model.sort('price');

      return this;
    }

    // exist
    const sortBy = sort.split(',').join(' ');
    model = model.sort(sortBy);

    return this;
  }

  fields() {
    let {
      model,
      queryString: { fields },
    } = this;

    if (!fields) {
      model = model.select('-__v');

      return this;
    }

    let handleFields = fields.split(',').join(' ');
    model = model.select(handleFields);

    return this;
  }

  pagination() {
    let {
      model,
      queryString: { page, limit },
    } = this;

    const pageNum = Number(page) || 1;
    const limitNumber = Number(limit) || 100;
    const skip = (pageNum - 1) * limitNumber;

    model = model.skip(skip).limit(limitNumber);

    return this;
  }
}

module.exports = ApiFeatures;
