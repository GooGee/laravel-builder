function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for generating routes
     */

    ddd.text = ddd.helper.makeRouteText('Api')
    ddd.prefix = `/v1`
    if (ddd.module.prefix) {
        ddd.prefix += ddd.module.prefix
    }
}
