import { Authorizer } from "../../../src/app/server_app/auth/Authorizer";
import { SessionTokenDataAccess } from "../../../src/app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../src/app/server_app/data/UserCredentialsDataAccess";

//SessionTokenDataBase Mock methods
const isValidTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();
const generateTokenMock = jest.fn();

//UserCredentialsDatabase Mock methods
const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock("../../../src/app/server_app/data/SessionTokenDataAccess", () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        isValidToken: isValidTokenMock,
        invalidateToken: invalidateTokenMock,
        generateToken: generateTokenMock,
      };
    }),
  };
});

jest.mock("../../../src/app/server_app/data/UserCredentialsDataAccess", () => {
  return {
    UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
      return {
        addUser: addUserMock,
        getUserByUserName: getUserByUserNameMock,
      };
    }),
  };
});

describe("Authorizer test suite", () => {
  let sut: Authorizer;
  const someUser = {
    id: "1",
    password: "password",
    userName: "kpatel",
  };

  beforeEach(() => {
    sut = new Authorizer();
    expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
    expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should validate token", async () => {
    const tokenId = "4";
    isValidTokenMock.mockImplementationOnce(() => Promise.resolve(true));
    //isValidTokenMock.mockResolvedValueOnce(true) //alternate to mockImplementationOnce()
    const actual = await sut.validateToken(tokenId);
    expect(actual).toBe(true);
  });

  it("should return id for new registered user", async () => {
    const accountId = "1";
    addUserMock.mockResolvedValueOnce(accountId);
    const actualAccountId = await sut.registerUser(
      someUser.userName,
      someUser.password
    );
    expect(actualAccountId).toBe(accountId);
    expect(addUserMock).toHaveBeenCalledWith({
      id: "",
      password: someUser.password,
      userName: someUser.userName,
    });
  });

  it('should return tokenId for valid credentials', async () => {
    getUserByUserNameMock.mockResolvedValueOnce({
        password: someUser.password
    })
    generateTokenMock.mockResolvedValueOnce('1');

    const actual = await sut.login(someUser.userName, someUser.password);

    expect(actual).toBe('1');
});

  it("should return undefined for invalid credentials", async () => {
    getUserByUserNameMock.mockResolvedValueOnce({
      password: someUser.password,
    });
    generateTokenMock.mockResolvedValueOnce('1');

    const actual = await sut.login(someUser.userName, "someOtherPassword");

    expect(actual).toBeUndefined();
  });

  it("should log user out", async () => {
    await sut.logout("1");
    expect(invalidateTokenMock).toHaveBeenCalledWith("1");
  });
});
