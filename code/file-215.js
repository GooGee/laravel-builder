function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const wu = ddd.db.tables.Wu.find(item => item.name === ddd.entity.name)
    if (wu === undefined) {
        ddd.columnzz = []
        return
    }
    ddd.columnzz = ddd.helper.makeAliasColumnzz(ddd.helper.getWuColumnzz(wu.id))

}
