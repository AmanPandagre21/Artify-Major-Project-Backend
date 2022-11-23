class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // search
  search() {
    const keyword = this.queryStr.keyword
      ? {
          title: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    if (this.queryStr.keyword) {
      this.query = this.query
        .find({ ...keyword })
        .sort({ createdAt: -1 })
        .populate("artist category likes");
    } else {
      this.query = this.query
        .find({ ...keyword })
        .limit(12)
        .sort({ createdAt: -1 })
        .populate("artist category likes");
    }

    return this;
  }
}

module.exports = ApiFeature;
