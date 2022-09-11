export function merge(a: Array<any>, b: Array<any>, prop: string) {
    var reduced = a.filter(
        (aitem) => !b.find((bitem) => aitem[prop] === bitem[prop])
    );
    return reduced.concat(b);
}
