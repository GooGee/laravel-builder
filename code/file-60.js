function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /** @type {Map<number, LB.TypeFormat>} */
    const citfm = new Map()
    ddd.db.tables.TypeFormat
        .filter(item => item.ownerColumnId > 0)
        .forEach(item => citfm.set(item.ownerColumnId, item))

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

    const ignore = new Set(['ParameterInCookie', 'ParameterInHeader'])
    const entityzz = ddd.db.tables.Entity.filter(item => !ignore.has(item.name))
        .sort((aa, bb) => aa.name.localeCompare(bb.name))
    ddd.typezz = entityzz.map((item) => {
        const linezz = [`    interface ${item.name} {`]
        const columnzz = eiczzm.get(item.id)
        if (columnzz) {
            columnzz.forEach((item) =>
                linezz.push(`        ${item.name}: ${makeType(item)}`)
            )
        }
        linezz.push("    }")
        return linezz.join("\n")
    })

    /**
     *
     * @param {LB.Column} item
     * @returns {string}
     */
    function makeType(item) {
        const tf = citfm.get(item.id)
        if (tf === undefined) {
            return 'any'
        }

        let zz = tf.type === "integer" ? "number" : tf.type
        if (tf.isArray) {
            zz += '[]'
        }
        if (tf.nullable) {
            zz += ' | null'
        }
        return zz
    }
}
