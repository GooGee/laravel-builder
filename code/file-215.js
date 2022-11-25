function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const name = `${ddd.schema.name}_${ddd.action}_DTO`
    const wu = ddd.db.tables.Wu.find(item => item.name === name)
    if (wu === undefined) {
        ddd.columnzz = []
        return
    }
    ddd.columnzz = ddd.helper.makeAliasColumnzz(ddd.helper.getWuColumnzz(wu.id))

}
