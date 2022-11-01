function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * write code below
     * it will be executed before generating files
     */

    ddd.module = ddd.db.tables.Module.find(item => item.name === 'Api')
    ddd.prefix = `/v1`
    if (ddd.module.prefix) {
        ddd.prefix += ddd.module.prefix
    }
}
