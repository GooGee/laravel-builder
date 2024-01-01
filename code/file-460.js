function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    ddd.columnzz = ddd.helper.getRequestColumnzz()

    if (ddd.columnzz.length === 0) {
        const requestName = `${ddd.entity.name}_UpdateOne_Request`
        const request = ddd.db.tables.Request.find(item => item.name === requestName)
        if (request) {
            ddd.columnzz = ddd.helper.getRequestColumnzz(request.id)
        }
    }
}
