import * as Utils from "../../../src/app/server_app/utils/Utils";

//testing of event based code

const requestMock = {
  on: jest.fn(),
};
const data = {
  name: "John",
  age: 30,
  city: "Azusa",
};

const dataAsString = JSON.stringify(data);

describe("getRequestBody test suite", () => {
  it("should return object for valid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "data") {
        cb(dataAsString); //returns json object
      } else {
        cb(); //returns json string if event is anything other than data
      }
    });
    const actual = await Utils.getRequestBody(requestMock as any);
    expect(actual).toEqual(data);
  });

  it("should throw error for invalid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "data") {
        cb("invalid arg");
      } else {
        cb();
      }
    });
    await expect(Utils.getRequestBody(requestMock as any)).rejects.toThrow(
      "Unexpected token"
    );
  });

  it("should throw error for unexpected error", async () => {
    const someError = new Error("Something went wrong!");
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "error") {
        cb(someError);
      }
    });
    await expect(Utils.getRequestBody(requestMock as any)).rejects.toThrow(
      someError.message
    );
  });
});
