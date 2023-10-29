function run(data) {
    // routs/api.php

    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for generating routes
     */

    ddd.text = ddd.helper.makeRouteText(ddd.module.name)
}
