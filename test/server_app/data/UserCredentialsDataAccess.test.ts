import { DataBase } from "../../../src/app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../src/app/server_app/data/UserCredentialsDataAccess"
import { Account } from "../../../src/app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();

//Injecting mock into consumer database class
//Mocking the ES6 database class
//Mock must be a function or an actual ES6 class 
//jest.mock(path, moduleFactory); moduleFactory is a function that returns the mock 
jest.mock('../../../src/app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => { //this mock imp returns the mocked db
            return {             //calling it as a constructor
                insert: insertMock, //insertMock is ref to insert mock
                getBy: getByMock    
            }
        })
    }
})
describe('UserCredDataAccess test suite', () => {
    let sut: UserCredentialsDataAccess;
    let userAcct : Account = {
        id: '1',
        userName: 'kpatel', 
        password: '1234'
    }
    const someId = '1'
    const someName = 'Kay'

    beforeEach(() => {
        sut = new UserCredentialsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should add user and return the id', async () => {
        insertMock.mockImplementationOnce(() => Promise.resolve(someId));
        //short form/alternative:
        //insertMock.mockResolvedValue(someId);
        const actualId = await sut.addUser(userAcct); //returns someId
        expect(actualId).toBe(someId);
        expect(insertMock).toHaveBeenCalledWith(userAcct);
    })

    it('should get user by id', async () => {
        getByMock.mockImplementationOnce(() => Promise.resolve(userAcct));
        const actualUser = await sut.getUserById(someId);
        expect(actualUser).toBe(userAcct);
        expect(getByMock).toHaveBeenCalledWith('id', someId);
    })

    it('should get user by username', async () => {
        getByMock.mockImplementationOnce(() => Promise.resolve(userAcct));
        const actualUser = await sut.getUserByUserName(someName);
        expect(actualUser).toBe(userAcct);
        expect(getByMock).toHaveBeenCalledWith('userName', someName);
    })


    
})