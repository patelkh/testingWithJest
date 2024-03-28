import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../src/app/server_app/auth/Authorizer";
import { RegisterHandler } from "../../../src/app/server_app/handlers/RegisterHandler";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../src/app/server_app/model/ServerModel";
import { Account } from "../../../src/app/server_app/model/AuthModel";

const getRequestBodyMock = jest.fn();
jest.mock("../../../src/app/server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock()
}));

describe("RegisterHandler test suit", () => {
  let sut: RegisterHandler;
  const requestMock = {
    method: "",
  };
  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };
  const authorizerMock = {
    registerUser: jest.fn(),
  };
  const userAccount: Account = {
    id: "1",
    userName: "Kay",
    password: "1234",
  };
  const userId = "1";


  beforeEach(() => {
    sut = new RegisterHandler(
      requestMock as IncomingMessage,
      responseMock as ServerResponse | any,
      authorizerMock as Authorizer | any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register valid account in requests", async () => {
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(userAccount); //mocked implementation of real getRequestBody()
    authorizerMock.registerUser.mockResolvedValueOnce(userId); //mocked implementation of real registerUser()
    await sut.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify({
        userId: userId,
      })
    );
  });

  it("should return an error", async () => {
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce({}); //mocked implementation of real getRequestBody()
    await sut.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify('userName and password required')
    );
  });

  it("should return nothing for all other http request", async () => {
    requestMock.method = HTTP_METHODS.GET;
    await sut.handleRequest();
    expect(responseMock.writeHead).not.toHaveBeenCalled();
    expect(responseMock.write).not.toHaveBeenCalled();
    expect(getRequestBodyMock).not.toHaveBeenCalled();
  });
  

});
