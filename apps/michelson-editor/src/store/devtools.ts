export const isDate = (d: any) => d instanceof Date;
export const isEmpty = (o: {}) => Object.keys(o).length === 0;
export const isObject = (o: null) => o != null && typeof o === 'object';
export const properObject = (o: any) => isObject(o) && !o.hasOwnProperty ? { ...o } : o;

export const diff = (lhs: any, rhs: any): any => {
    if (lhs === rhs) return {}; // equal return no diff

    if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

    const l: any = properObject(lhs);
    const r: any = properObject(rhs);

    const deletedValues = Object.keys(l).reduce((acc, key) => {
        return r.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
    }, {});

    if (isDate(l) || isDate(r)) {
        // tslint:disable-next-line:triple-equals
        if (l.valueOf() == r.valueOf()) return {};
        return r;
    }

    return Object.keys(r).reduce((acc, key) => {
        if (!l.hasOwnProperty(key)) return { ...acc, [key]: r[key] }; // return added r key

        const difference = diff(l[key], r[key]);

        if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc; // return no diff

        return { ...acc, [key]: difference }; // return updated key
    }, deletedValues);
};

