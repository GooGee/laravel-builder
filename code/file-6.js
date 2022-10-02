function run(data) {
    /** @type {DataForScript} */
    const ddd = data

    /** @type {Map<number, Column[]>} */
    const columnmap = new Map()
    ddd.db.tables.Column.forEach(item => {
        if (item.inTable === false) {
            return
        }
        let found = columnmap.get(item.schemaId)
        if (found === undefined) {
            found = []
            columnmap.set(item.schemaId, found)
        }
        found.push(item)
    })

    ddd.typezz = ddd.db.tables.Schema.map(item => {
        const linezz = [`    interface ${item.name} {`]
        const columnzz = columnmap.get(item.id)
        if (columnzz) {
            columnzz.forEach(item => {
                linezz.push(`        ${item.name}: ${getType(item)}`)
            })
        }
        linezz.push('    }')
        return linezz.join('\n')
    })

    /**
     *
     * @param {Column} item
     * @returns {string}
     */
    function getType(item) {
        if (item.dtoType === 'integer') {
            return 'number'
        }
        return item.dtoType
    }
}
