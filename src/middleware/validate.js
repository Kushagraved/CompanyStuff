const joi = require('joi');
const REQ_PARAMTERS = {
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params'
};

const schemas = {
  saveToDb: joi.object({
    urlLink: joi.string().allow('https://store-0001.s3.amazonaws.com/input.csv').required()
  }),
  getTopRankedCompanies: joi.object({
    sector: joi.string().min(2).alphanum().required()
  }),
  updateCompany: {
    params: joi.object({
      id: joi.string().required().min(10)
    }),
    body: joi.object({
      ceo: joi.string().min(2).max(255)
    })
  }
};

const validate = (schema, parameterType) => (req, res, next) => {
  // console.log(schema)
  // console.log(parameterType)
  const { error } = schema.validate(req[parameterType]);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = { validate, REQ_PARAMTERS, schemas };