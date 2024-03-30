import * as IdGenerator from '../../../src/app/server_app/data/IdGenerator'


describe('generateRandomId test suite', () => {
    it('should return a random string', () => {
        const randomID = IdGenerator.generateRandomId();
        expect(randomID.length).toBe(20);
    })

})