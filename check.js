'use strict';

function getType(value) {
    let type = typeof value;
    if (Array.isArray(value)) {
        type = 'array';
    }

    return type;
}

function getWithNot(object, answer) {
    if (object.hasOwnProperty('not')) {
        return !answer;
    }

    return answer;
}

const forEvery = {
    isNull: function () {
        return getWithNot(this, this === null);
    }
};

const forObjects = {
    containsKeys: function (keys) {
        let count = 0;
        for (let key in this.workingObject) {
            if (this.workingObject.hasOwnProperty(key) && keys.indexOf(key) !== -1) {
                count += 1;
            }
        }
        let result = count === keys.length;

        return getWithNot(this, result);
    },
    hasKeys: function (keys) {
        let result = true;
        let count = 0;
        for (let key in this.workingObject) {
            if (this.workingObject.hasOwnProperty(key) && keys.indexOf(key) === -1) {
                result = false;
            } else {
                count += 1;
            }
        }
        if (count !== keys.length) {
            result = false;
        }

        return getWithNot(this, result);
    },
    containsValue: function (value) {
        let result = false;
        for (let key in this.workingObject) {
            if (this.workingObject.hasOwnProperty(key) && this.workingObject[key] === value) {
                result = true;
            }
        }

        return getWithNot(this, result);
    },
    containsValues: function (values) {
        for (let value of values) {
            if (!this.containsValue(value)) {
                return false;
            }
        }

        return true;
    },
    hasValues: function (values) {
        let result = true;
        let count = 0;
        for (let key in this.workingObject) {
            if (this.workingObject.hasOwnProperty(key) &&
                values.indexOf(this.workingObject[key]) === -1) {
                result = false;
            } else {
                count += 1;
            }
        }
        if (count !== values.length) {
            result = false;
        }

        return getWithNot(this, result);
    },
    hasValueType: function (key, type) {
        let value = this.workingObject[key];

        let result = getType(value) === getType(type());

        return getWithNot(this, result);
    }
};

const forArray = {
    hasLength: function (length) {
        let count = 0;
        for (let prop in this.workingObject) {
            if (this.workingObject.hasOwnProperty(prop)) {
                count += 1;
            }
        }
        let result = count === length;

        return getWithNot(this, result);
    }
};

const forString = {
    hasWordsCount: function (count) {
        let words = this.workingObject.split(' ');
        let length = 0;
        for (let word of words) {
            if (word.length >= 1) {
                length += 1;
            }
        }
        let result = length === count;

        return getWithNot(this, result);
    }
};

const forFunction = {
    hasParamsCount: function (count) {
        let result = this.workingObject.length === count;

        return getWithNot(this, result);
    }
};

function tryCall(context, func, args) {
    let result = false;
    if (context.object !== null && context.object.hasOwnProperty(func.name)) {
        result = func.apply(context.object, args);
    }

    return getWithNot(context, result);
}

exports.wrap = function (variable) {
    let object = variable === null ? null : variable.check;

    return {
        object: object,
        isNull: function () {
            let result = this.object === null ? true : this.object.isNull();

            return getWithNot(this, result);
        },
        containsKeys: function (keys) {
            return tryCall(this, forObjects.containsKeys, [keys]);
        },
        hasKeys: function (keys) {
            return tryCall(this, forObjects.hasKeys, [keys]);
        },
        containsValues: function (values) {
            return tryCall(this, forObjects.containsValues, [values]);
        },
        hasValues: function (values) {
            return tryCall(this, forObjects.hasValues, [values]);
        },
        hasValueType: function (key, type) {
            return tryCall(this, forObjects.hasValueType, [key, type]);
        },
        hasLength: function (length) {
            return tryCall(this, forArray.hasLength, [length]);
        },
        hasParamsCount: function (count) {
            return tryCall(this, forFunction.hasParamsCount, [count]);
        },
        hasWordsCount: function (count) {
            return tryCall(this, forString.hasWordsCount, [count]);
        }
    };
};

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        configurable: true,
        get: function () {
            let type = getType(this);
            switch (type) {
                case 'object':
                    return Object.assign({ workingObject: this }, forObjects, forEvery);
                case 'array':
                    return Object.assign({ workingObject: this }, forObjects, forArray, forEvery);
                case 'string':
                    return Object.assign({ workingObject: this }, forArray, forString, forEvery);
                case 'function':
                    return Object.assign({ workingObject: this }, forFunction, forEvery);
                default:
                    return this;
            }
        }
    });

    Object.defineProperty(Object.prototype, 'not', {
        configurable: true,
        get: function () {
            return Object.assign({ not: true }, this);
        }
    });
};
