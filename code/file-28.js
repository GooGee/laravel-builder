function run(data) {
    /** @type {DataForScript} */
    const ddd = data

    const columnzz = ddd.db.tables.Column.filter((item) => item.schemaId === ddd.schema.id)
    ddd.columnzz = columnzz

    const cn = ddd.tree.getClassName(ddd.file, ddd.schema, ddd.action)
    const wu = ddd.wu ?? ddd.db.tables.Wu.find(item => item.name === cn)
    if (wu) {
        const wczz = ddd.db.tables.WuColumn.filter(item => item.wuId === wu.id)
        const set = new Set(wczz.map(item => item.columnId))
        ddd.columnzz = columnzz.filter(item => set.has(item.id))
    }

}
