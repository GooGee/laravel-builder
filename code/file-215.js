function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const name = `DTO_${ddd.action}${ddd.schema.name}`
    const wu = ddd.db.tables.Wu.find(item => item.name === name)
    if (wu === undefined) {
        ddd.columnzz = []
        return
    }
    ddd.columnzz = ddd.helper.makeAliasColumnzz(ddd.helper.getWuColumnzz(wu.id))

}
