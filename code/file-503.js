function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /** @type {Map<number, LB.Column[]>} */
    const columnmap = new Map()
    ddd.db.tables.Column.forEach((item) => {
        if (item.inTable === false) {
            return
        }
        let found = columnmap.get(item.entityId)
        if (found === undefined) {
            found = []
            columnmap.set(item.entityId, found)
        }
        found.push(item)
    })

    ddd.typezz = ddd.db.tables.Entity.map((item) => {
        const linezz = [`    interface ${item.name} {`]
        const columnzz = columnmap.get(item.id)
        if (columnzz) {
            columnzz.forEach((item) => {
                linezz.push(`        ${item.name}: ${getType(item)}`)
            })
        }
        linezz.push("    }")
        return linezz.join("\n")
    })

    /**
     *
     * @param {LB.Column} item
     * @returns {string}
     */
    function getType(item) {
        if (item.dtoType === "integer") {
            return "number"
        }
        return item.dtoType
    }
}
