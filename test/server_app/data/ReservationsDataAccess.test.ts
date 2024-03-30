import { DataBase } from "../../../src/app/server_app/data/DataBase";
import { ReservationsDataAccess } from "../../../src/app/server_app/data/ReservationsDataAccess";
import * as IdGenerator from "../../../src/app/server_app/data/IdGenerator";
import { Reservation } from "../../../src/app/server_app/model/ReservationModel";

const insertMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const getByMock = jest.fn();
const getAllElementsMock = jest.fn();
const findAllByMock = jest.fn();

jest.mock("../../../src/app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      //this mock imp returns the mocked db
      return {
        //calling it as a constructor
        insert: insertMock, //insertMock is ref to insert mock
        update: updateMock,
        delete: deleteMock,
        getBy: getByMock,
        getAllElements: getAllElementsMock,
        findAllBy: findAllByMock,
      };
    }),
  };
});

describe("ReservationsDataAccess test suite", () => {
  let sut: ReservationsDataAccess;
  const someReservation: Reservation = {
    id: "",
    room: "200",
    user: "kpatel",
    startDate: "3/29/2024",
    endDate: "4/2/2024",
  };
  const someId = "1";

  beforeEach(() => {
    sut = new ReservationsDataAccess();
    jest.spyOn(IdGenerator, "generateRandomId").mockReturnValueOnce(someId);
  });

  afterEach(() => {
    jest.clearAllMocks();
    someReservation.id = "";
  });

  it("should return id of newly created reservation", async () => {
    insertMock.mockResolvedValueOnce(someId);
    const actual = await sut.createReservation(someReservation);
    expect(actual).toBe(someId);
    expect(insertMock).toHaveBeenCalledWith(someReservation);
  });

  it("should update existing reservation", async () => {
    await sut.updateReservation(someId, "endDate", "4/5/2024");
    expect(updateMock).toHaveBeenCalledWith(someId, "endDate", "4/5/2024");
  });

  it("should delete existing reservations", async () => {
    await sut.deleteReservation(someId);
    expect(deleteMock).toHaveBeenCalledWith(someId);
  });

  it("should return reservation by Id", async () => {
    getByMock.mockResolvedValueOnce(someReservation);
    const actual = sut.getReservation(someId);
    expect(getByMock).toHaveBeenCalledWith("id", someId);
  });

  it("should return all reservations", async () => {
    getAllElementsMock.mockResolvedValueOnce([
      someReservation,
      someReservation,
    ]);
    const actual = sut.getAllReservations();
    expect(actual).toEqual([someReservation, someReservation]);
    expect(getAllElementsMock).toHaveBeenCalledTimes(1);
  });
});
