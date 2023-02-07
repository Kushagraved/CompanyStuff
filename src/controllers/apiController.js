// const { readCSV, getCompanyDetails, getTopRankedCompaniesService, updateCompanyService, getSectorDetails, saveToDbService, getCompanyScores } = require('../services/apiServices');
const apiServices = require('../services/apiServices');
const saveToDb = async (req, res) => {
  try {

    const { urlLink } = req.body;

    const { companyIds, sectors, mapIdToSector } = await apiServices.readCSV(urlLink);

    const companyDetails = await apiServices.getCompanyDetails(companyIds);
    // console.log(companyDetails);

    const sectorDetails = await apiServices.getSectorDetails(sectors);
    // console.log(sectorDetails);
    const companyScores = await apiServices.getCompanyScores({ companyDetails, sectorDetails });
    const dbDetails = await apiServices.saveToDbService({ companyDetails, companyScores, mapIdToSector });

    res.status(201).json(dbDetails);


  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    // next(error);
  }
};

const getTopRankedCompanies = async (req, res) => {
  try {
    const { sector } = req.query;
    const topCompanies = await apiServices.getTopRankedCompaniesService(sector);
    res.status(200).json(topCompanies);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { ceo } = req.body;
    const updatedCompany = await apiServices.updateCompanyService({ id, ceo });
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = {
  saveToDb,
  getTopRankedCompanies,
  updateCompany
};