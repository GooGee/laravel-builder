function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const columnzz = ddd.helper.getResponseContentColumnzz(true)
    const cr = ddd.helper.getColumnzzAndReferencezz(columnzz)
    ddd.columnzz = cr[0]
    ddd.referencezz = cr[1]
}
