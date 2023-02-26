function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * only include ModuleAction which has Response
     * @type {Set<number>}
     */
    const mais = new Set(ddd.db.tables.ModuleActionResponse.map(item => item.moduleActionId))
    const set = new Set(ddd.db.tables.ModuleAction
        .filter(item => mais.has(item.id) && item.moduleId === 1)
        .map(item => item.entityId))
    ddd.entityzz = ddd.db.tables.Entity
        .filter(item => set.has(item.id))
        .sort((aa, bb) => aa.name.localeCompare(bb.name))
}
