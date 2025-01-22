const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Joi extension to escape HTML from user input -> don't think this is necessary for this project
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [], // zenzen html tags is not allowed
                    allowedAttributes: {}, // zenzen html attributes is not allowed
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value }) // if the value is not the same as the clean value, return an error
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})