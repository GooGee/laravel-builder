function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * write code below
     * it will be executed before generating files
     */

    ddd.text = ddd.helper.makeRouteText(ddd.module.name)
}
