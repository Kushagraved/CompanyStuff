const { readCSV, getCompanyDetails, getSectorDetails, getCompanyScores, saveToDbService } = require('../src/services/apiServices');
const CSV = require('csv-string');
const { Company } = require('../database/models');
const axios = require('axios');

// test readCSV function
describe('readCSV', () => {
  it('should return companyIds, sectors and mapIdToSector', async () => {
    // mock CSV.parse function with return value
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: 'something\n1,Software'
    });
    jest.spyOn(CSV, 'parse').mockReturnValue([
      [],
      ['1', 'Software'],
    ]);
    const result = await readCSV('https://s3-ap-southeast-1.amazonaws.com/he-public-data/TopRamen8d30951.csv');
    expect(result).toEqual({
      companyIds: ['1'],
      sectors: ['Software'],
      mapIdToSector: new Map([['1', 'Software']])
    });
  });
});

//test getCompanyDetails function by mocking axios.get
describe('getCompanyDetails', () => {
  it('should return company details', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        'id': '1',
        'name': 'Nissin Foods',
        'description': 'dsbckdsac',
        'ceo': 'Toshitaka Shiga',
        'tags': [],
      }
    });
    const result = await getCompanyDetails(['1']);
    expect(result).toEqual([{
      'id': '1',
      'name': 'Nissin Foods',
      'description': 'dsbckdsac',
      'ceo': 'Toshitaka Shiga',
      'tags': [],
    }]);
  });
});


//test getSectorDetails function by mocking axios.get
describe('getSectorDetails', () => {
  it('should return sector details', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: [{
        'companyId': '8888888888-888888-009900-999999999',
        'performanceIndex': [{
          'key': 'cpi',
          'value': 0.2
        }, {
          'key': 'cf',
          'value': 30000
        }, {
          'key': 'mau',
          'value': 0.1
        }, {
          'key': 'roic',
          'value': 20
        }],
      }]
    });
    const result = await getSectorDetails(['1']);
    expect(result).toEqual([[{
      'companyId': '8888888888-888888-009900-999999999',
      'performanceIndex': [{
        'key': 'cpi',
        'value': 0.2
      }, {
        'key': 'cf',
        'value': 30000
      }, {
        'key': 'mau',
        'value': 0.1
      }, {
        'key': 'roic',
        'value': 20
      }]
    }]]);
  });
});

//test getCompanyScores function 
describe('getCompanyScores', () => {
  it('should return company scores', async () => {
    const companyDetails = [{
      'id': '1',
      'name': 'Nissin Foods',
      'description': 'dsbckdsac',
      'ceo': 'Toshitaka Shiga',
      'tags': [],
    }];
    const sectorDetails = [[{
      'companyId': '8888888888-888888-009900-999999999',
      'performanceIndex': [{
        'key': 'cpi',
        'value': 0.2
      }]
    }]];
    const result = getCompanyScores({ companyDetails, sectorDetails });

    expect(result).toEqual([{
      'id': '1',
      'score': 0
    }]);
  });
});

//test saveToDbService function 
describe('saveToDbService', () => {
  it('should save company details to db', async () => {
    const companyDetails = [{
      'id': '1',
      'name': 'Nissin Foods',
      'description': 'dsbckdsac',
      'ceo': 'Toshitaka Shiga',
      'tags': [],
    }];
    const companyScores = [{
      'id': '1',
      'score': 0
    }];
    const mapIdToSector = new Map([['1', 'Software']]);
    jest.spyOn(Company, 'bulkCreate').mockResolvedValue({
    });
    const result = await saveToDbService({ companyDetails, companyScores, mapIdToSector });
    expect(result).toEqual([{
      'id': '1',
      'name': 'Nissin Foods',
      'description': 'dsbckdsac',
      'ceo': 'Toshitaka Shiga',
      'tags': [],
      'score': 0,
      'sector': 'Software'
    }]);
  });
});
