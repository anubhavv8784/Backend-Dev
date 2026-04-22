function softDeletePlugin(schema) {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  });

  function excludeDeleted(next) {
    if (!this.getOptions || !this.getOptions().includeDeleted) {
      this.where({ isDeleted: false });
    }

    next();
  }

  schema.pre("find", excludeDeleted);
  schema.pre("findOne", excludeDeleted);
  schema.pre("countDocuments", excludeDeleted);
  schema.pre("findOneAndUpdate", excludeDeleted);
  schema.pre("findOneAndDelete", excludeDeleted);

  schema.pre("deleteOne", { document: true, query: false }, async function softDeleteDocument(next) {
    if (!this.isDeleted) {
      this.isDeleted = true;
      this.deletedAt = new Date();
      await this.save();
    }

    const softDeleteSignal = new Error("Document soft deleted");
    softDeleteSignal.name = "SoftDeleteComplete";
    next(softDeleteSignal);
  });

  schema.statics.findDeleted = function findDeleted() {
    return this.find({ isDeleted: true }).setOptions({ includeDeleted: true });
  };
}

module.exports = softDeletePlugin;
