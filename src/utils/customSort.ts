function handleSubArraySorting(y: any, z: any): -1 | 0 | 1 {
    const ySorted = y.sort(sortFn);
    const zSorted = z.sort(sortFn);

    const itemInY = ySorted[0];
    const itemInZ = zSorted[0];

    const typeofItemInY = typeof itemInY;
    const typeofItemInZ = typeof itemInZ;
    if (typeofItemInY === typeofItemInZ) {
        if (typeofItemInY === "object") {
            const itemInYIsDate = itemInY instanceof Date;
            const itemInZIsDate = itemInZ instanceof Date;
            if (itemInYIsDate) {
                if (itemInZIsDate) {
                    const valueOfItemInY = itemInY.valueOf();
                    const valueOfItemInZ = itemInZ.valueOf();
                    return valueOfItemInY < valueOfItemInZ
                        ? -1
                        : valueOfItemInY === valueOfItemInZ
                        ? 0
                        : 1;
                }
                return -1; // treat dates as less than arrays and objects, so y < z
            } else if (itemInZIsDate) return 1; // treat dates as less than arrays and objects, so z < y

            const itemInYIsArray = Array.isArray(itemInY);
            const itemInZIsArray = Array.isArray(itemInZ);
            if (itemInYIsArray) {
                if (itemInZIsArray) {
                    return itemInY.length < itemInZ.length
                        ? -1
                        : itemInY.length === itemInZ.length
                        ? handleSubArraySorting(itemInY, itemInZ)
                        : 1;
                } else return -1; // treat arrays as less than objects, so y < z
            } else if (itemInZIsArray) {
                return 1; // treat arrays as less than objects, so z < y;
            }

            // Both are objects (the `{key: value}` kind)
            const keysOfItemInY = Object.keys(itemInY);
            const keysOfItemInZ = Object.keys(itemInZ);

            if (keysOfItemInY.length !== keysOfItemInZ.length) {
                return keysOfItemInY.length < keysOfItemInZ.length ? -1 : 1;
            }
            keysOfItemInY.sort();
            keysOfItemInZ.sort();

            const itemInKeysOfItemInY = keysOfItemInY[0];
            const itemInKeysOfItemInZ = keysOfItemInZ[0];

            return itemInKeysOfItemInY < itemInKeysOfItemInZ
                ? -1
                : itemInKeysOfItemInY === itemInKeysOfItemInZ
                ? 0
                : 1;
        }
    } else if (typeofItemInY === "object") {
        return 1; // treat objects as more than non-objects, so y > z
    } else if (typeofItemInZ === "object") {
        return -1; // treat objects as more than non-objects, so z > y;
    }
    return itemInY < itemInZ ? -1 : itemInY === itemInZ ? 0 : 1;
}

/**
 * Allows for definitively positioned sorting of objects.
 */
export function sortFn(y: any, z: any) {
    const typeofY = typeof y;
    const typeofZ = typeof z;
    if (typeofY === typeofZ) {
        if (typeofY === "object") {
            const yIsDate = y instanceof Date;
            const zIsDate = z instanceof Date;
            if (yIsDate) {
                if (zIsDate) {
                    const yAsUnix = y.valueOf();
                    const zAsUnix = z.valueOf();
                    return yAsUnix < zAsUnix ? -1 : yAsUnix === zAsUnix ? 0 : 1;
                } else {
                    return -1; // treat dates as less than arrays and objects, so y < z
                }
            } else if (zIsDate) return 1; // treat dates as less than arrays and objects, so z < y

            // At this point, y and z are either array or object (not necessarily same)
            const yIsArray = Array.isArray(y);
            const zIsArray = Array.isArray(z);
            if (yIsArray) {
                if (zIsArray) {
                    return y.length < z.length
                        ? -1
                        : y.length === z.length
                        ? handleSubArraySorting(y, z)
                        : 1;
                } else {
                    return -1; // treat arrays as less than objects, so y < z
                }
            } else if (zIsArray) {
                return 1; // treat arrays as less than objects, so z < y
            }

            // Both are objects (the `{key: value}` kind)
            const keysOfY = Object.keys(y);
            const keysOfZ = Object.keys(z);

            if (keysOfY.length !== keysOfZ.length) {
                return keysOfY.length < keysOfZ.length ? -1 : 1;
            }
            keysOfY.sort();
            keysOfZ.sort();

            const itemInKeysOfY = keysOfY[0];
            const itemInKeysOfZ = keysOfZ[0];

            return itemInKeysOfY < itemInKeysOfZ ? -1 : itemInKeysOfY === itemInKeysOfZ ? 0 : 1;
        }
    } else if (typeofY === "object") return 1; // treat objects as more than non-objects, so y > z
    else if (typeofZ === "object") return -1; // treat objects as more than non-objects, so z > y
    return y < z ? -1 : y === z ? 0 : 1;
}
