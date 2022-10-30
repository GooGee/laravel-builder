function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const typezz = ddd.helper.getItemzzInCollection("DoctrineColumnType")

    /**
     * get PHP type of column
     * @param {LB.Column} column
     * @returns {string}
     */
    function makeColumnType(column) {
        const found = typezz.find((item) => item.name === column.type)
        if (found) {
            if (column.nullable) {
                return '?' + found.tag
            }
            return found.tag
        }

        return ""
    }

    ddd.makeColumnType = makeColumnType

    ddd.columnzz = ddd.helper.getRequestColumnzz(ddd.ma)

}
