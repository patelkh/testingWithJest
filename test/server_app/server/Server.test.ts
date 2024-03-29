import { Server } from "../../../src/app/server_app/server/Server"

jest.mock('../../../src/app/server_app/auth/Authorizer')
jest.mock('../../../src/app/server_app/data/ReservationsDataAccess')
jest.mock('../../../src/app/server_app/handlers/LoginHandler')
jest.mock('../../../src/app/server_app/handlers/RegisterHandler')
jest.mock('../../../src/app/server_app/handlers/ReservationsHandler')


const requestMock = {
    url: '',
    headers: {
        'user-agent': 'jest-test'
    }
}
const responseMock = {
    end: jest.fn(),
    writeHead: jest.fn()
}
const serverMock = {
    listen: jest.fn(),
    close: jest.fn()
}
jest.mock('http', () => ({
    createServer: (cb: Function) => {
        cb(requestMock, responseMock)
        return serverMock
    }
}))



describe('Server test suite', () => {
    let sut: Server

    beforeEach(() => {
        sut = new Server();
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should start server without errors', () => {
        sut.startServer();
    })

})