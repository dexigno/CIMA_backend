class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };

    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    queryStr = JSON.parse(queryStr);

    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort({ createdAt: -1 });
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const limitedFields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(limitedFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const limit = this.queryStr.limit * 1 || 1398;
    const page = this.queryStr.page * 1 || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
