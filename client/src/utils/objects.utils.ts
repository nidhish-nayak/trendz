interface AnyObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export function objectsAreEqual(obj1: AnyObject, obj2: AnyObject): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}
