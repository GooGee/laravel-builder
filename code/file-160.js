function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    ddd.columnzz = ddd.helper.getRequestColumnzz().filter(item => item.name !== 'Id')

}
