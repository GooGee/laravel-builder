function run(data) {
    // routs/web.php

    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for generating routes
     */

    ddd.text = ddd.helper.makeRouteText(ddd.module.name)
}
