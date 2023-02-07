const axios = require('axios');
const CSV = require('csv-string');
const { Company } = require('../../database/models');
const { calculateScore } = require('../utils/apiUtils');
// const HTTPError = require('../utils/httpError');


const readCSV = async (urlLink) => {
  const { data } = await axios.get(urlLink);
  // console.log(data);
  const parsedCsv = CSV.parse(data);
  parsedCsv.shift();
  const companyIds = [];
  let sectors = [];
  const mapIdToSector = new Map();
  parsedCsv.forEach(([companyId, sector]) => {
    companyIds.push(companyId);
    sectors.push(sector);
    mapIdToSector.set(companyId, sector);
  });

  sectors = [...new Set(sectors)];
  // console.log(companyIds, sectors);
  return { companyIds, sectors, mapIdToSector };
};

const getCompanyDetails = async (companyIds) => {

  //(Method 1)(Using promiseall)

  const responses = await Promise.all(
    companyIds.map((id) => {
      return axios.get(`http://localhost:4000/company/${id}`);
    })
  );

  const companyDetails = responses.map((response) => {
    return response.data;
  });
  return companyDetails;

  //(Method 2)(Using forloop)
  // const output = [];
  // for (const company of companies) {
  //   const { company_id, company_sector } = company;
  //   // console.log('id',company_id);
  //   const { data: getCompanyById } = await axios.get(`http://54.167.46.10/company/${company_id}`);
  //   // console.log(getCompanyById);


  //   const { data: getCompanyBySector } = await axios.get(`http://54.167.46.10/sector?name=${company_sector}`);
  //   const companyPerformance = getCompanyBySector.filter((company) => {
  //     return company.companyId === company_id;
  //   });

  //   let totalPerformace = 0;
  //   companyPerformance[0].performanceIndex.forEach((company) => {
  //     const { key, value } = company;
  //     //   console.log(key,val);
  //     if (key == 'cpi') {
  //       totalPerformace += (value) * 10;
  //     }
  //     else if (key == 'cf') {
  //       totalPerformace += (value / 10000);
  //     }
  //     else if (key == 'mau') {
  //       totalPerformace += (value * 10);
  //     }
  //     else {
  //       totalPerformace += value;
  //     }
  //   });
  //   totalPerformace = totalPerformace / 4;
  //   output.push({ id: company_id, name: getCompanyById?.name, ceo: getCompanyById.ceo, sector: company_sector, score: totalPerformace });
  // }

  // await Company.bulkCreate(output);
  // return output;
};

const getSectorDetails = async (sectors) => {
  const responses = await Promise.all(
    sectors.map((sector) => {
      return axios.get(`http://localhost:4000/sector?name=${sector}`);

    })
  );
  const sectorDetails = responses.map((response) => {
    return response.data;
  });
  return sectorDetails;
};

const getCompanyScores = ({ companyDetails, sectorDetails }) => {
  const companyScores = [];
  companyDetails.forEach((company) => {
    const { id } = company;  //id name desc ceo tags
    let performanceIndex = [];
    sectorDetails.forEach((sector) => {
      const find = sector.find((company) => {
        return company.companyId === id;
      });
      if (find) {
        performanceIndex = find.performanceIndex;
      }
    });

    const score = calculateScore(performanceIndex);
    companyScores.push({
      id, score
    });

  });
  return companyScores;

};

const saveToDbService = async ({ companyDetails, companyScores, mapIdToSector }) => {
  const dbDetails = [];
  companyDetails.forEach((company) => {
    dbDetails.push({
      ...company,
      score: companyScores.find((companyScore) => {
        return companyScore.id === company.id;
      })?.score,
      sector: mapIdToSector.get(company.id)
    });
  });

  await Company.bulkCreate(dbDetails);
  return dbDetails;

};

const getTopRankedCompaniesService = async (sector) => {
  const companies = await Company.findAll({
    where: {
      sector: sector
    },
    order: [
      ['score', 'DESC']
    ],
    attributes: ['id', 'name', 'ceo', 'sector', 'score'],
    raw: true
  });
  console.log(companies);
  const topCompanies = companies.map((company, idx) => {
    return {
      ...company,
      rankings: idx + 1
    };
  });

  return topCompanies;
};

const updateCompanyService = async ({ id, ceo }) => {
  const updatedCompany = await Company.update({ ceo }, {
    where: {
      id
    },
    returning: true
  });
  return updatedCompany;

};

module.exports = {
  readCSV,
  getCompanyDetails,
  getSectorDetails,
  getTopRankedCompaniesService,
  updateCompanyService,
  saveToDbService,
  getCompanyScores
};