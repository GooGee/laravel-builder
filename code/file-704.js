function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const columnzz = ddd.helper.getResponseContentColumnzz(true).filter(item => item.type !== 'datetime')
    const cr = ddd.helper.getColumnzzAndReferencezz(columnzz)
    ddd.columnzz = cr[0].filter(function (item) {
        if (item.type === 'text') {
            return false
        }
        if (item.type === 'string' && item.length > 111) {
            return false
        }
        return true
    })
}
