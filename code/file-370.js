function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    ddd.module = ddd.db.tables.Module.find(item => item.name === 'Api')
    ddd.prefix = `/V1`
    if (ddd.module.prefix) {
        ddd.prefix += ddd.module.prefix
    }
}
