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
          description: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query
      .find({ ...keyword })
      .sort({ createdAt: -1 })
      .populate("artist category likes");

    return this;
  }

  // filter
  //     filter() {
  //         const queryStr = { ...this.queryStr };

  //   }
}

module.exports = ApiFeature;
