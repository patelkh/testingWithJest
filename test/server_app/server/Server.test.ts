import { Authorizer } from "../../../src/app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../src/app/server_app/data/ReservationsDataAccess";
import { LoginHandler } from "../../../src/app/server_app/handlers/LoginHandler";
import { RegisterHandler } from "../../../src/app/server_app/handlers/RegisterHandler";
import { ReservationsHandler } from "../../../src/app/server_app/handlers/ReservationsHandler";
import { HTTP_CODES } from "../../../src/app/server_app/model/ServerModel";
import { Server } from "../../../src/app/server_app/server/Server";

jest.mock("../../../src/app/server_app/auth/Authorizer");
jest.mock("../../../src/app/server_app/data/ReservationsDataAccess");
jest.mock("../../../src/app/server_app/handlers/LoginHandler");
jest.mock("../../../src/app/server_app/handlers/RegisterHandler");
jest.mock("../../../src/app/server_app/handlers/ReservationsHandler");

const requestMock = {
  url: "",
  headers: {
    "user-agent": "jest-test",
  },
};
const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn(),
};
const serverMock = {
  listen: jest.fn(),
  close: jest.fn(),
};
jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestMock, responseMock);
    return serverMock;
  },
}));

describe("Server test suite", () => {
  let sut: Server;

  beforeEach(() => {
    sut = new Server();
    expect(Authorizer).toHaveBeenCalledTimes(1);
    expect(ReservationsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should start server without errors", async () => {
    await sut.startServer();
    expect(serverMock.listen).toHaveBeenCalledWith(8080);
  });

  it("should handle register request", async () => {
    requestMock.url = "localhost:8080/register";
    //.prototype - you're targeting methods that instances of RegisterHandler will inherit and potentially call.
    const handleRequestSpy = jest.spyOn(
      RegisterHandler.prototype,
      "handleRequest"
    );
    await sut.startServer();
    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(RegisterHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  it("should handle login request", async () => {
    requestMock.url = "localhost:8080/login";
    const handleRequestSpy = jest.spyOn(
      LoginHandler.prototype,
      "handleRequest"
    );
    await sut.startServer();
    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(LoginHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  it("should handle reservation request", async () => {
    requestMock.url = "localhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    await sut.startServer();
    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(ReservationsHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess)
    );
  });

  it("should do nothing for not supported route", async () => {
    requestMock.url = "localhost:8080/someRandomRoute";
    const validateTokenTokenSpy = jest.spyOn(Authorizer.prototype, "login");
    await sut.startServer();
    expect(validateTokenTokenSpy).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    requestMock.url = "localhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    handleRequestSpy.mockRejectedValueOnce(new Error("Some Error"));
    await sut.startServer();
    expect(responseMock.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify(`Internal server error: Some Error`)
    );
  });

  it("should stop the server if stopped", async () => {
    serverMock.close.mockImplementationOnce((cb: Function) => {
      cb();
    });
    await sut.startServer();
    await sut.stopServer();
    expect(serverMock.close).toHaveBeenCalledTimes(1);
  });

  it("should forward error while stopping server", async () => {
    serverMock.close.mockImplementationOnce((cb: Function) => {
      cb(new Error("Error while closing server!"));
    });

    await sut.startServer();

    expect(async () => {
      await sut.stopServer();
    }).rejects.toThrow("Error while closing server!");

    expect(serverMock.close).toHaveBeenCalledTimes(1);
  });
});
