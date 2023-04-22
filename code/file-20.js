function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /** @type {Map<number, LB.Entity>} */
    const em = new Map()
    ddd.db.tables.Entity.forEach(item => em.set(item.id, item))

    /** @type {string[]}*/
    const linezz = []
    ddd.db.tables.ModuleAction.forEach(function (ma) {
        const entity = em.get(ma.entityId)
        if (entity === undefined) {
            throw new Error(ma.entityId + ' does not exist')
        }

        let hasEvent = false
        ma.filezz.sort((aa, bb) => aa.layer.localeCompare(bb.layer))
            .forEach(function (file) {
                const cn = ddd.tree.getClassFullName(file, entity, ma.name)
                if (cn.endsWith('Event')) {
                    if (hasEvent) {
                        linezz.push('        ],')
                    }
                    hasEvent = true
                    linezz.push(`        \\${cn}::class => [`)
                }
                if (cn.endsWith('Listener')) {
                    linezz.push(`            \\${cn}::class,`)
                }
            })
        if (hasEvent) {
            linezz.push('        ],\n')
        }
    })
    ddd.text = linezz.join('\n')
}
