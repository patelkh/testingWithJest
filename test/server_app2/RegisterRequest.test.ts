import { DataBase } from "../../src/app/server_app/data/DataBase";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../src/app/server_app/model/ServerModel";
import { Server } from "../../src/app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

jest.mock("../../src/app/server_app/data/DataBase");
const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();
const fakeServer = {
  listen: () => {},
  close: () => {},
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestWrapper, responseWrapper);
    return fakeServer;
  },
}));

describe("RegisterRequest test suite", () => {
  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
  });

  it("should register new users", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {
      userName: "kpatel",
      password: "password",
    };
    requestWrapper.url = "localhost:8080/register";
    jest.spyOn(DataBase.prototype, "insert").mockResolvedValue("1234");
    await new Server().startServer();
    await new Promise(process.nextTick); //this solves timing issues
    expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseWrapper.body).toEqual(
      expect.objectContaining({
        userId: expect.any(String),
      })
    );
  });

  it("should reject user with no username and passsword", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {};
    requestWrapper.url = "localhost:8080/register";
    await new Server().startServer();
    await new Promise(process.nextTick); //this solves timing issues
    expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseWrapper.body).toEqual(expect.any(String));
  });

  it("should do nothing for unsupported requests", async () => {
    requestWrapper.method = HTTP_METHODS.GET;
    requestWrapper.url = "localhost:8080/register";
    await new Server().startServer();
    await new Promise(process.nextTick); //this solves timing issues
    expect(responseWrapper.statusCode).toBeUndefined();
    expect(responseWrapper.body).toBeUndefined();
  });

});
