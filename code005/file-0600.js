function run(data) {
    // resources/TypeScriptDeclaration

    /** @type {LB.DataForScript} */
    const ddd = data

    /** @type {Map<number, LB.TypeFormat>} */
    const citfm = new Map()
    ddd.db.tables.TypeFormat
        .filter(item => item.ownerColumnId > 0)
        .forEach(item => citfm.set(item.ownerColumnId, item))

    /** @type {Map<number, LB.Column[]>} */
    const eiczzm = new Map()
    ddd.db.tables.Column.filter(item => item.inTable)
        .forEach((item) => {
            if (item.hidden || item.wo) {
                return
            }

            let found = eiczzm.get(item.entityId)
            if (found == null) {
                found = []
                eiczzm.set(item.entityId, found)
            }
            found.push(item)
        })

    /** @type {Map<number, LB.Wu[]>} */
    const eiwzzm = new Map()
    ddd.db.tables.Wu.forEach((item) => {
        let found = eiwzzm.get(item.entityId)
        if (found == null) {
            found = []
            eiwzzm.set(item.entityId, found)
        }
        found.push(item)
    })

    /** @type {Map<number, LB.WuParameter[]>} */
    const wiwpzzm = new Map()
    ddd.db.tables.WuParameter.forEach((item) => {
        let found = wiwpzzm.get(item.wuId)
        if (found == null) {
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
            columnzz.forEach((item) => linezz.push(`        ${item.name}: ${makeType(item)}`))
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
        if (item.type === 'boolean') {
            return item.type
        }
        const tf = citfm.get(item.id)
        if (tf == null) {
            return 'any'
        }

        let zz = tf.type === "integer" ? "number" : tf.type
        if (tf.isArray) {
            zz += '[]'
        }
        if (tf.nullable || item.nullable) {
            zz += ' | null'
        }
        return zz
    }
}
