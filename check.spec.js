/* eslint-env mocha */
'use strict';

const assert = require('assert');

const check = require('./check');

check.init();

describe('CheckObject', function () {
    const person = {
        name: 'John',
        age: 20,
        func: function () {
            return true;
        },
        arr: [1, 2, 3]
    };

    it('should check that target containsKeys for workingObject', function () {
        assert.ok(person.check.containsKeys(['name']));
    });

    it('should check that target hasKeys for workingObject', function () {
        assert.ok(person.check.hasKeys(['name', 'age', 'arr', 'func']));
    });

    it ('should check that target hasKeys for workingObject incorrect', function () {
        assert.ok(!person.check.hasKeys(['name']));
    });

    it('should check that target containsValues for workingObject', function () {
        assert.ok(person.check.containsValues(['John']));
    });

    it('should check that target hasValues for workingObject', function () {
        assert.ok(!person.check.hasValues([20, 'John']));
    });

    it('should check that target hasValues for workingObject incorrect', function () {
        assert.ok(!person.check.hasValues([20]));
    });

    it('should check that target hasValueType for workingObject incorrect', function () {
        assert.ok(!person.check.hasValueType('age', String));
    });

    it('should check that target hasValueType for workingObject', function () {
        assert.ok(person.check.hasValueType('name', String));
    });

    it('value is Array', function () {
        assert.ok(person.check.hasValueType('arr', Array));
    });

    it('value is Function', function () {
        assert.ok(person.check.hasValueType('func', Function));
    });
});

describe('CheckArray', function () {
    const numbers = [1, 2, 3];
    let arr = [1, 2];
    arr[5] = 6;

    it('should check that target containsKeys for array', function () {
        assert.ok(numbers.check.containsKeys(['0', '2']));
    });

    it('should check not contains keys for array', function () {
        assert.ok(!arr.check.containsKeys(['0', '3']));
    });

    it('check not own property', function () {
        assert.ok(!numbers.check.containsKeys(['length']));
    });

    it('should check that target hasKeys', function () {
        assert.ok(numbers.check.hasKeys(['0', '1', '2']));
    });

    it('should check has only this keys', function () {
        assert.ok(arr.check.hasKeys(['0', '1', '5']));
    });

    it('should check has many keys', function () {
        assert.ok(!numbers.check.hasKeys(['0', '1', '2', '3']));
    });

    it('should check that target containsValues for array', function () {
        assert.ok(numbers.check.containsValues([2, 1]));
    });

    it('should check that target hasValues for array', function () {
        assert.ok(numbers.check.hasValues([2, 1, 3]));
    });

    it('should check that target hasLength for array', function () {
        assert.ok(numbers.check.hasLength(3));
    });

    it('should check has length array with undefined elements', function () {
        assert.ok(arr.check.hasLength(3));
    });
});

describe('CheckStringAndFunction', function () {
    const func = function (a, b) {
        return a + b;
    };
    const str = 'some string';

    it('should check that target hasLength for string', function () {
        assert.ok(str.check.hasLength(11));
    });

    it('should check that target hasParamsCount', function () {
        assert.ok(func.check.hasParamsCount(2));
    });

    it('should check that target hasWordsCount', function () {
        assert.ok(str.check.hasWordsCount(2));
    });

    it('check empty string with hasWordsCount', function () {
        assert.ok(''.check.hasWordsCount(0));
    });

    it('check string without words', function () {
        assert.ok('       '.check.hasWordsCount(0));
    });
});

describe('Null', function () {
    const wrappedNull = check.wrap(null);
    const wrappedString = check.wrap('hello');
    const wrappedArray = check.wrap([1, 2, 3]);

    it('Null is null', function () {
        assert.ok(wrappedNull.isNull());
    });

    it('Null don`t have length', function () {
        assert.ok(!wrappedNull.hasLength(5));
    });

    it('String is not null', function () {
        assert.ok(!wrappedString.isNull());
    });

    it('Sting have property length', function () {
        assert.ok(wrappedString.hasLength(5));
    });

    it('String haven`t property hasParamsCount', function () {
        assert.ok(!wrappedString.hasParamsCount(2));
    });

    it('String haven`t property containsKeys', function () {
        assert.ok(!wrappedString.containsKeys(['1']));
    });

    it('Array have property containsValue', function () {
        assert.ok(wrappedArray.containsValues([1, 3]));
    });

    it('Array have property hasLength', function () {
        assert.ok(!wrappedArray.hasLength(2));
    });

    it('Array haven`t property hasWordsCount', function () {
        assert.ok(!wrappedArray.hasWordsCount(3));
    });

    it('Work with not', function () {
        assert.ok(wrappedArray.not.hasLength(2));
    });
});

describe('Not', function () {
    let me = {
        name: 'Roman',
        age: 26
    };

    it('not with containsKeys property', function () {
        assert.ok(!me.check.not.containsKeys(['age', 'name']));
    });

    it('not with hasValueType property', function () {
        assert.ok(me.check.not.hasValueType('age', String));
    });
});
