'use strict';

const forObjects = {
    containsKeys: function (keys) {
        let result = true;
        for (let key of keys) {
            if (!this.workingObject.hasOwnProperty(key)) {
                result = false;
            }
        }
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    },
    hasKeys: function (keys) {
        let result = true;
        for (let key in this.workingObject) {
            if (this.workingObject.hasOwnProperty(key) && keys.indexOf(key) === -1) {
                result = false;
            }
        }
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    },
    containsValue: function (value) {
        let result = false;
        for (let key in this.workingObject) {
            if (this.workingObject.hasOwnProperty(key) && this.workingObject[key] === value) {
                result = true;
            }
        }
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    },
    containsValues: function (values) {
        let result = true;
        for (let value of values) {
            if (!this.containsValue(value)) {
                result = false;
            }
        }
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    },
    hasValues: function (values) {
        let result = true;
        for (let key in this.workingObject) {
            if (this.workingObject.hasOwnProperty(key) &&
                values.indexOf(this.workingObject[key]) === -1) {
                result = false;
            }
        }
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    },
    hasValueType: function (key, type) {
        let value = this.workingObject[key];
        let typeValue = (type(value)).valueOf();

        let result = typeof value === typeof typeValue;
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
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
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    }
};

const forString = {
    hasWordsCount: function (count) {
        let words = this.workingObject.split(' ');

        let result = words.length === count;
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    }
};

const forFunction = {
    hasParamsCount: function (count) {
        let result = this.workingObject.length === count;
        if (this.hasOwnProperty('not')) {
            return !result;
        }

        return result;
    }
};

exports.wrap = function (variable) {
    return {
        object: variable,
        isNull: function () {
            return this.object === null;
        },
        containsKeys: function (keys) {
            let result;
            try {
                result = variable.check.containsKeys(keys);
            } catch (err) {
                return false;
            }

            return result;
        },
        hasKeys: function (keys) {
            let result;
            try {
                result = variable.check.hasKeys(keys);
            } catch (err) {
                return false;
            }

            return result;
        },
        containsValues: function (values) {
            let result;
            try {
                result = variable.check.containsValues(values);
            } catch (err) {
                return false;
            }

            return result;
        },
        hasValues: function (values) {
            let result;
            try {
                result = variable.check.hasValues(values);
            } catch (err) {
                return false;
            }

            return result;
        },
        hasValueType: function (key, type) {
            let result;
            try {
                result = variable.check.hasValueType(key, type);
            } catch (err) {
                return false;
            }

            return result;
        },
        hasLength: function (length) {
            let result;
            try {
                result = variable.check.hasLength(length);
            } catch (err) {
                return false;
            }

            return result;
        },
        hasParamsCount: function (count) {
            let result;
            try {
                result = variable.check.hasParamsCount(count);
            } catch (err) {
                return false;
            }

            return result;
        },
        hasWordsCount: function (count) {
            let result;
            try {
                result = variable.check.hasWordsCount(count);
            } catch (err) {
                return false;
            }

            return result;
        }
    };
};

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        configurable: true,
        get: function () {
            let type = typeof this;
            if (Array.isArray(this)) {
                type = 'array';
            }
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
