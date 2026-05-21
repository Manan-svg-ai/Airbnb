const Joi = require("joi");

const stripHtml = (value) => value.replace(/<[^>]*>/g, "");

const escapeHTML = (value, helpers) => {
    if (stripHtml(value) !== value) {
        return helpers.error("string.escapeHTML", { value });
    }
    return value;
};

const JoiWithHtml = Joi.extend((joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                return escapeHTML(value, helpers);
            }
        }
    }
}));
const listingSchema = Joi.object({
    listing : Joi.object({
        title : JoiWithHtml.string().required().escapeHTML(),
        description: JoiWithHtml.string().required().escapeHTML(),
        price : Joi.number().required().min(0),
        location : JoiWithHtml.string().required().escapeHTML(),
        country : JoiWithHtml.string().required().escapeHTML(),
        image : JoiWithHtml.string().allow("", null).escapeHTML()
    }).required()
});

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : JoiWithHtml.string().required().escapeHTML()
    }).required(),
});

module.exports = { listingSchema, reviewSchema };
