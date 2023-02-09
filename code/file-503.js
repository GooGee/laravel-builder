function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /** @type {Map<number, LB.Column[]>} */
    const eiczzm = new Map()
    ddd.db.tables.Column.forEach((item) => {
        // if (item.inTable === false) {
        //     return
        // }
        let found = eiczzm.get(item.entityId)
        if (found === undefined) {
            found = []
            eiczzm.set(item.entityId, found)
        }
        found.push(item)
    })

    /** @type {Map<number, LB.Wu[]>} */
    const eiwzzm = new Map()
    ddd.db.tables.Wu.forEach((item) => {
        let found = eiwzzm.get(item.entityId)
        if (found === undefined) {
            found = []
            eiwzzm.set(item.entityId, found)
        }
        found.push(item)
    })

    /** @type {Map<number, LB.WuParameter[]>} */
    const wiwpzzm = new Map()
    ddd.db.tables.WuParameter.forEach((item) => {
        let found = wiwpzzm.get(item.wuId)
        if (found === undefined) {
            found = []
            wiwpzzm.set(item.wuId, found)
        }
        found.push(item)
    })

    ddd.typezz = ddd.db.tables.Entity.map((item) => {
        const linezz = [`    interface ${item.name} {`]
        const columnzz = eiczzm.get(item.id)
        if (columnzz) {
            columnzz.forEach((item) => {
                linezz.push(`        ${item.name}: ${makeType(item)}`)
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
        if (item.tf.type === "integer") {
            return "number"
        }
        return item.tf.type
    }

    /**
     *
     * @param {LB.Column} item
     * @returns {string}
     */
    function makeType(item) {
        let zz = getType(item)
        if (item.tf.isArray) {
            zz += '[]'
        }
        if (item.tf.nullable) {
            zz += ' | null'
        }
        return zz
    }
}
