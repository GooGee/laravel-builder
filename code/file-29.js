function run(data) {
    /** @type {DataForScript} */
    const ddd = data

    const typezz = ddd.helper.getItemzzInCollection("DoctrineColumnType")

    /**
     * get PHP type of column
     * @param {Column} column
     * @returns {string}
     */
    function makeColumnType(column) {
        const found = typezz.find((item) => item.name === column.type)
        if (found) {
            return found.tag
        }

        return ""
    }
    ddd.makeColumnType = makeColumnType

    ddd.columnzz = ddd.helper.getRequestColumnzz(ddd.ma)

}
