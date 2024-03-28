import { LoginHandler } from "../../../src/app/server_app/handlers/LoginHandler"
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../src/app/server_app/auth/Authorizer";
import { Account } from "../../../src/app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../src/app/server_app/model/ServerModel"
import { getRequestBody } from "../../../src/app/server_app/utils/Utils";

const getRequestBodyMock = jest.fn(); 
jest.mock('../../../src/app/server_app/utils/Utils', () => ({
    getRequestBody: () =>  getRequestBodyMock()
}))


describe('LoginHandler test suite', () => {

    let sut: LoginHandler;
    let requestMock = {
        method: ''
    }
    let responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn()
    }
    let authorizerMock = {
        login: jest.fn()
    }
    let userAccount: Account = {
        id: '1', 
        userName: 'Kay',
        password: '789'
    }
    let userId = '1';
    let someToken = '89RH4';

    beforeEach(() => {
        sut = new LoginHandler(
            requestMock as IncomingMessage | any,
            responseMock as ServerResponse | any,
            authorizerMock as Authorizer | any
        );
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return token for valid accounts in requests', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(userAccount);
        authorizerMock.login.mockResolvedValueOnce(someToken);
        await sut.handleRequest();
        
        expect(authorizerMock.login).toHaveBeenCalledWith(userAccount.userName, userAccount.password);
        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({token: someToken}))
    })

    it('should return user not found for invalid accounts in requests', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(userAccount);
        authorizerMock.login.mockResolvedValueOnce(undefined);
        await sut.handleRequest();
        
        expect(authorizerMock.login).toHaveBeenCalledWith(userAccount.userName, userAccount.password);
        expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('wrong username or password'))
    })

    it('should return bad request for invalid requests', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce({});
        await sut.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('userName and password required'))
    })
    
    it('should do nothing for all other http requests', async () => {
        requestMock.method = HTTP_METHODS.GET;
        await sut.handleRequest();
        expect(authorizerMock.login).not.toHaveBeenCalled();
    })

})