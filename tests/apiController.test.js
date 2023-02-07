const apiServices = require('../src/services/apiServices');
const { saveToDb } = require('../src/controllers/apiController');
describe('save to database', () => {
  it('should return company details to be stored in db', async () => {
    // mock apiServices call and write test for saveToDb controller
    const mockReadCSV = jest.spyOn(apiServices, 'readCSV').mockResolvedValue({
      companyIds: ['1', '2', '3'],
      sectors: ['sector1', 'sector2'],
      mapIdToSector: { '1': 'sector1', '2': 'sector2', '3': 'sector1' }
    });
    const mockGetCompanyDetails = jest.spyOn(apiServices, 'getCompanyDetails').mockResolvedValue([
      {
        'id': '1',
        'name': 'Nissin Foods',
        'description': 'dsbckdsac',
        'ceo': 'Toshitaka Shiga',
        'tags': [],
      }
    ]);
    const mockGetSectorDetails = jest.spyOn(apiServices, 'getSectorDetails').mockResolvedValue([
      [{
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
    ]);
    const mockGetCompanyScores = jest.spyOn(apiServices, 'getCompanyScores').mockResolvedValue([
      {
        'id': '1',
        'score': '0.2'
      }
    ]);
    const mockSaveToDbService = jest.spyOn(apiServices, 'saveToDbService').mockResolvedValue([]);
    const mockReq = { body: { urlLink: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/TopRamen8d30951.csv' } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockNext = jest.fn();
    await saveToDb(mockReq, mockRes, mockNext);
    expect(mockReadCSV).toHaveBeenCalled();
    expect(mockGetCompanyDetails).toHaveBeenCalled();
    expect(mockGetSectorDetails).toHaveBeenCalled();
    expect(mockGetCompanyScores).toHaveBeenCalled();
    expect(mockSaveToDbService).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });
});

