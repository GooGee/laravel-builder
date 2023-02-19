function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const mais = new Set(ddd.db.tables.ModuleActionResponse.map(item => item.moduleActionId))
    const set = new Set(ddd.db.tables.ModuleAction.filter(item => mais.has(item.id)).map(item => item.entityId))
    ddd.entityzz = ddd.db.tables.Entity.filter(item => set.has(item.id))
    ddd.rf = ddd.helper.findFile('makeItemResource')
}
