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

const forObjects = {
    containsKeys: function (keys) {
        let result = true;
        for (let key of keys) {
            if (!this.workingObject.hasOwnProperty(key)) {
                result = false;
            }
        }

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

exports.wrap = function (variable) {
    let object = variable === null ? null : variable.check;

    return {
        object: object,
        isNull: function () {
            return this.object === null;
        },
        containsKeys: function (keys) {
            let result;
            try {
                result = this.object.containsKeys(keys);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
        },
        hasKeys: function (keys) {
            let result;
            try {
                result = this.object.hasKeys(keys);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
        },
        containsValues: function (values) {
            let result;
            try {
                result = this.object.containsValues(values);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
        },
        hasValues: function (values) {
            let result;
            try {
                result = this.object.hasValues(values);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
        },
        hasValueType: function (key, type) {
            let result;
            try {
                result = this.object.hasValueType(key, type);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
        },
        hasLength: function (length) {
            let result;
            try {
                result = this.object.hasLength(length);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
        },
        hasParamsCount: function (count) {
            let result;
            try {
                result = this.object.hasParamsCount(count);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
        },
        hasWordsCount: function (count) {
            let result;
            try {
                result = this.object.hasWordsCount(count);
            } catch (err) {
                result = false;
            }

            return getWithNot(this, result);
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
                    return Object.assign({ workingObject: this }, forObjects);
                case 'array':
                    return Object.assign({ workingObject: this }, forObjects, forArray);
                case 'string':
                    return Object.assign({ workingObject: this }, forArray, forString);
                case 'function':
                    return Object.assign({ workingObject: this }, forFunction);
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
