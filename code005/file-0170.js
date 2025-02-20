function run(data) {
    // app/ApiEvent

    /** @type {LB.DataForScript} */
    const ddd = data

    /** @type {Map<number, LB.Entity>} */
    const em = new Map()
    ddd.db.tables.Entity.forEach(item => em.set(item.id, item))

    /** @type {string[]}*/
    const linezz = []
    ddd.db.tables.ModuleAction.sort(function (aa, bb) {
        if (aa.entityId === bb.entityId) {
            return aa.name.localeCompare(bb.name)
        }

        const entity1 = em.get(aa.entityId)
        if (entity1 === undefined) {
            throw new Error(aa.entityId + ' does not exist')
        }

        const entity2 = em.get(bb.entityId)
        if (entity2 === undefined) {
            throw new Error(bb.entityId + ' does not exist')
        }

        return entity1.name.localeCompare(entity2.name)
    })
        .forEach(function (ma) {
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
