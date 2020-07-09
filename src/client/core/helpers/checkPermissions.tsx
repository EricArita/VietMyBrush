export const checkPermissions = (userPermissions: string[], validPermissions: string[]) => {
    if (!validPermissions || !validPermissions.length) return true;
    if (!userPermissions || !userPermissions) return false;
    const valid = validPermissions.filter((item: string) => {
        const existed = userPermissions.find((i: string) => i === item);
        return !existed;
    });
    return !(valid && valid.length);
};
