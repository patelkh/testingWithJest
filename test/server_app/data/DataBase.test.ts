import { DataBase } from "../../../src/app/server_app/data/DataBase"
import * as IdGenerator from "../../../src/app/server_app/data/IdGenerator";

type someTypeWithId = {
    id: string, 
    name: string, 
    color: string 
}

describe('DataBase test suite', () => {
    let sut: DataBase<someTypeWithId>;
    const fakeId = '1234';
    const someObject = {
        id: '1', 
        name: 'someName', 
        color: 'someColor'
    }
    const otherObject = {
        id: '2',
        name: 'someName',
        color: 'otherColor'
    }
    beforeEach(() => {
        sut = new DataBase<someTypeWithId>();
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(fakeId);
    })

    it('should return id after insert', async () => {
        const actual = await sut.insert({
            id: '',
            name: '',
            color: ''
        })
        expect(actual).toBe(fakeId);
    })

    it('should get element after insert', async () => {
        const id = await sut.insert(someObject);
        const actual = await sut.getBy('id', id);
        expect(actual).toBe(someObject);
    })

    it('should find all elements with same name', async () => {
        await sut.insert(someObject);
        await sut.insert(otherObject);
        const expected = [someObject, otherObject]
        const actual = await sut.findAllBy('name', 'someName');
        expect(actual).toEqual(expected);
    })

    it('should update element\'s color', async () => {
        const id = await sut.insert(someObject);
        const expectedColor = 'red';
        await sut.update(id, 'color', expectedColor);
        const object = await sut.getBy('id', id);
        const actualColor = object?.color;
        expect(actualColor).toEqual(expectedColor);
    })

    it('should delete the element from database', async () => {
        const id = await sut.insert(someObject);
        await sut.delete(id);
        const element = await sut.getBy('id', id);
        expect(element).toBeUndefined();
    })

    it('should get all elements in the database', async () => {
        await sut.insert(someObject);
        await sut.insert(otherObject);
        const expected = [someObject, otherObject];
        const actual = await sut.getAllElements();
        expect(actual).toEqual(expected);
    })

})